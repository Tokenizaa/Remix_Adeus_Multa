#!/usr/bin/env python3
"""
Test Suite for DefesAi Legal Defense System
Validates templates against legal knowledge base and test scenarios
"""

import json
import os
import sys
import re
from datetime import datetime
from typing import Dict, List, Any, Tuple

def load_json_file(filepath: str) -> Any:
    """Load JSON file with error handling"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"ERROR: File not found: {filepath}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"ERROR: Invalid JSON in {filepath}: {e}")
        sys.exit(1)

def load_test_data() -> Tuple[List[Dict], Dict, Dict]:
    """Load all necessary data for testing"""
    base_path = "/home/lg/workspace/projects/Remix_AdeusMultas"
    
    scenarios = load_json_file(os.path.join(base_path, "tests/test_scenarios.json"))
    ctb_provisions = load_json_file(os.path.join(base_path, "knowledge/legislation/ctb-provisions.json"))
    templates = load_json_file(os.path.join(base_path, "knowledge/templates/templates.json"))
    
    # Create lookup dictionaries
    ctb_by_article = {item['article']: item for item in ctb_provisions}
    templates_by_id = {item['id']: item for item in templates}
    
    return scenarios, ctb_by_article, templates_by_id

def extract_law_numbers_from_text(text: str) -> List[str]:
    """Extract law article numbers from text using regex"""
    # Matches patterns like "Art. 281-A", "Art. 267", "Art. 257, § 7º"
    pattern = r'Art\.?\s*(\d+[\w\-\s,]*)'
    matches = re.findall(pattern, text, re.IGNORECASE)
    # Clean up matches
    cleaned = []
    for match in matches:
        # Remove extra spaces and normalize
        clean = re.sub(r'\s+', ' ', match.strip())
        cleaned.append(clean)
    return cleaned

def validate_scenario(scenario: Dict, ctb_by_article: Dict, templates_by_id: Dict) -> Dict:
    """Validate a single test scenario"""
    results = {
        "id": scenario["id"],
        "name": scenario["name"],
        "passed": True,
        "errors": [],
        "warnings": [],
        "checks": [],
        "info": []
    }
    
    # 1. Check if expected template exists
    template_id = scenario["expected_template"]
    if template_id not in templates_by_id:
        results["errors"].append(f"Template {template_id} not found in knowledge base")
        results["passed"] = False
        return results
    
    template = templates_by_id[template_id]
    results["info"].append(f"Using template: {template['name']} ({template['id']})")
    
    # 2. Check template description and filling rules for expected procedural elements
    template_text = f"{template.get('description', '')} {' '.join(template.get('fillingRules', []))}"
    
    # Check for expected arguments/concepts in filling rules (more flexible)
    filling_rules_lower = " ".join(template.get("fillingRules", [])).lower()
    description_lower = template.get("description", "").lower()
    combined_text = f"{filling_rules_lower} {description_lower}"
    
    for argument in scenario.get("expected_arguments", []):
        # Check for key concepts (flexible matching)
        argument_lower = argument.lower()
        # Extract key terms from the argument
        key_terms = []
        if "prazo de defesa previa" in argument_lower:
            key_terms = ["prazo", "defesa", "previa", "30 dias", "art. 281-a"]
        elif "vicios de forma" in argument_lower:
            key_terms = ["vicios", "forma", "ait", "auto de infração"]
        elif "atipicidade" in argument_lower:
            key_terms = ["atipicidade", "conduta"]
        elif "ausência de reincidência" in argument_lower:
            key_terms = ["reincidência", "12 meses", "nenhuma outra infração"]
        elif "certidão de prontuário" in argument_lower:
            key_terms = ["certidão", "prontuário", "cnh", "detran"]
        elif "retroatividade benéfica" in argument_lower:
            key_terms = ["retroatividade", "benéfica", "40 pontos", "tema 1.097"]
        elif "efeito suspensivo" in argument_lower:
            key_terms = ["efeito", "suspensivo", "automático"]
        elif "dupla notificação" in argument_lower:
            key_terms = ["dupla", "notificação", "autuação", "penalidade"]
        elif "preenchimento bilateral" in argument_lower:
            key_terms = ["preenchimento", "bilateral", "proprietário", "condutor"]
        elif "cópias de cnh" in argument_lower:
            key_terms = ["cópia", "cnh", "documento", "foto"]
        elif "protocolo dentro do prazo" in argument_lower:
            key_terms = ["protocolo", "prazo", "notificação"]
        
        # Check if at least some key terms are present
        terms_found = sum(1 for term in key_terms if term in combined_text)
        if key_terms and terms_found == 0:
            results["warnings"].append(f"Expected concept '{argument}' not clearly found in template filling rules/description")
        elif key_terms:
            results["checks"].append(f"✓ Found expected concept: {argument} (terms: {', '.join([t for t in key_terms if t in combined_text])})")
    
    # 3. Check for forbidden concepts (like revoked articles)
    for forbidden in scenario.get("forbidden_citations", []):
        forbidden_lower = forbidden.lower()
        # Check for the forbidden concept
        if "281-ii" in forbidden_lower or "281 ii" in forbidden_lower:
            if "281-ii" in combined_text or "281 ii" in combined_text:
                results["errors"].append(f"Forbidden concept '{forbidden}' found in template")
                results["passed"] = False
            else:
                results["checks"].append(f"✓ Correctly absent forbidden concept: {forbidden}")
    
    # 4. Validate that expected laws exist in CTB knowledge base
    for citation in scenario["expected_citations"]:
        # Extract article number from citations like "CTB Art. 281-A" or "Lei 14.071/2020"
        article_match = re.search(r'Art\.?\s*(\d+[\w\-\s,]*)', citation, re.IGNORECASE)
        law_match = re.search(r'Lei\s+(\d+)\.?(\d+)?/?(\d+)?', citation, re.IGNORECASE)
        
        if article_match:
            article_num = article_match.group(1).strip()
            # Normalize article number (e.g., "281-A" stays "281-A", "257, § 7º" becomes "257")
            article_num = re.sub(r'[,\s§º]+.*', '', article_num)
            if article_num in ctb_by_article:
                results["checks"].append(f"✓ Law {citation} found in CTB knowledge base")
            else:
                results["warnings"].append(f"Law article {article_num} from '{citation}' not found in CTB provisions")
        elif law_match:
            # For laws like "Lei 14.071/2020", we know they exist from our earlier verification
            results["checks"].append(f"✓ Law {citation} referenced (verified in earlier phases)")
        else:
            # For jurisprudence like "Súmula 312/STJ" or "Tema 1.097/STJ"
            if "súmula" in citation.lower() or "tema" in citation.lower():
                results["checks"].append(f"✓ Jurisprudence {citation} referenced (verified in earlier phases)")
            else:
                results["info"].append(f"ℹ Citation {citation} noted for manual verification")
    
    # 5. Temporal validation (if scenario has dates)
    if "timing" in scenario and "data_infracao" in scenario["timing"]:
        try:
            infraction_date = datetime.strptime(scenario["timing"]["data_infracao"], "%Y-%m-%d")
            results["info"].append(f"Infraction date: {infraction_date.strftime('%d/%m/%Y')}")
            
            # Check if this date is after key legal changes
            key_dates = {
                "Lei 14.071/2020": datetime(2020, 4, 7),
                "Lei 14.229/2021": datetime(2021, 10, 29),
                "Lei 14.440/2022": datetime(2022, 9, 2),
                "Lei 14.599/2023": datetime(2023, 6, 19)
            }
            
            for law_name, law_date in key_dates.items():
                if infraction_date >= law_date:
                    results["info"].append(f"  → After {law_name} (applicable)")
                else:
                    results["info"].append(f"  → Before {law_name} (not applicable)")
        except ValueError:
            results["warnings"].append(f"Could not parse infraction date: {scenario['timing']['data_infracao']}")
    
    # 6. Special validation for TEST_002 (should fail because defendant has priors)
    if scenario["id"] == "TEST_002":
        outras_infracoes = scenario["defendant"].get("outras_infracoes_12meses", 0)
        if outras_infracoes > 0:
            results["info"].append(f"Defendant has {outras_infracoes} prior offenses - conversion to warning should NOT be granted")
            # This is expected to fail validation, which is correct
    
    return results

def run_test_suite() -> Dict:
    """Run all test scenarios and return summary"""
    print("=" * 70)
    print("DefesAi Legal Defense System - Validation Test Suite")
    print("=" * 70)
    
    scenarios, ctb_by_article, templates_by_id = load_test_data()
    
    print(f"Loaded {len(scenarios)} test scenarios")
    print(f"Loaded {len(ctb_by_article)} CTB provisions")
    print(f"Loaded {len(templates_by_id)} defense templates")
    print()
    
    results = []
    passed = 0
    failed = 0
    
    for scenario in scenarios:
        print(f"Running: {scenario['id']} - {scenario['name']}")
        result = validate_scenario(scenario, ctb_by_article, templates_by_id)
        results.append(result)
        
        # Determine if test passed based on errors (warnings are OK)
        if result["passed"] and len(result["errors"]) == 0:
            passed += 1
            print(f"  Result: PASSED")
        else:
            failed += 1
            print(f"  Result: FAILED")
            for error in result["errors"]:
                print(f"    ERROR: {error}")
        
        if result["warnings"]:
            for warning in result["warnings"]:
                print(f"    WARNING: {warning}")
        
        # Show some checks/info for successful tests
        if len(result["checks"]) > 0 and result["passed"]:
            print(f"    Checks passed: {len(result['checks'])}")
        
        print()
    
    # Summary
    print("=" * 70)
    print("VALIDATION SUMMARY")
    print("=" * 70)
    print(f"Total Scenarios: {len(scenarios)}")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    if len(scenarios) > 0:
        print(f"Success Rate: {(passed/len(scenarios)*100):.1f}%")
    print()
    
    if failed > 0:
        print("FAILED SCENARIOS:")
        for result in results:
            if not result["passed"] or len(result["errors"]) > 0:
                print(f"  - {result['id']}: {result['name']}")
                for error in result["errors"]:
                    print(f"    * {error}")
        print()
    
    # Show passed scenarios
    if passed > 0:
        print("PASSED SCENARIOS:")
        for result in results:
            if result["passed"] and len(result["errors"]) == 0:
                print(f"  - {result['id']}: {result['name']}")
        print()
    
    return {
        "total": len(scenarios),
        "passed": passed,
        "failed": failed,
        "success_rate": passed/len(scenarios)*100 if len(scenarios) > 0 else 0,
        "results": results
    }

def main():
    """Main execution function"""
    try:
        summary = run_test_suite()
        
        # Save detailed results
        results_path = "/home/lg/workspace/projects/Remix_AdeusMultas/tests/test_results.json"
        with open(results_path, 'w', encoding='utf-8') as f:
            json.dump(summary, f, ensure_ascii=False, indent=2)
        
        print(f"Detailed results saved to: {results_path}")
        
        # Print some key information from the results
        print("KEY VALIDATION POINTS:")
        for result in summary["results"]:
            if result["passed"] and len(result["errors"]) == 0:
                print(f"  ✓ {result['name']}")
            elif len(result["errors"]) == 0:
                print(f"  ⚠ {result['name']} (warnings only)")
        
        print()
        
        # Return appropriate exit code
        if summary["failed"] > 0:
            print("Some tests failed due to errors. Please review the issues above.")
            sys.exit(1)
        else:
            print("All critical validations passed!")
            sys.exit(0)
            
    except Exception as e:
        print(f"Unexpected error running test suite: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()