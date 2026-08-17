import { AuditLogEntry } from '../../types';

/**
 * Service to manage audit logs - moved from global scope in server.ts
 */
export class AuditService {
  private auditLogs: AuditLogEntry[] = [];

  // Get a copy of the audit logs array
  getAuditLogs(): AuditLogEntry[] {
    return [...this.auditLogs];
  }

  // Add an audit log entry
  addAuditLog(entry: AuditLogEntry): void {
    this.auditLogs.unshift(entry); // Add to beginning like in original code
  }

  // Clear all audit logs
  clearAuditLogs(): void {
    this.auditLogs = [];
  }

  // Get audit logs with filtering (basic implementation)
  getAuditLogsFiltered(options: {
    limit?: number;
    offset?: number;
    search?: string;
    level?: string;
    service?: string;
    // Add more filters as needed
  }): AuditLogEntry[] {
    let filtered = [...this.auditLogs];

    // Apply filters
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filtered = filtered.filter(log =>
        (log.actor?.toLowerCase().includes(searchLower) ||
         log.action?.toLowerCase().includes(searchLower) ||
         (log.details && log.details.toLowerCase().includes(searchLower)))
      );
    }

    // Apply limit and offset
    if (options.offset !== undefined) {
      filtered = filtered.slice(options.offset);
    }
    if (options.limit !== undefined) {
      filtered = filtered.slice(0, options.limit);
    }

    return filtered;
  }
}

// Export singleton instance
export const auditService = new AuditService();