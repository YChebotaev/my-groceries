import { createService, logger } from './lib'

createService()
  .then(service => service.listen({
    port: Number(process.env['PORT'] ?? 3000),
    host: process.env['HOST'] ?? '0.0.0.0'
  }))
  .catch(e => logger.fatal(e))
