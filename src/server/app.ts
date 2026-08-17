// Add this import near the top with other imports
import pagbankV1Router from './routes/pagbank-v1.routes';

// Add this where other routes are mounted (around where other app.use() calls are)
// Mount the v1 PagBank routes
app.use('/api/v1/pagbank', pagbankV1Router);