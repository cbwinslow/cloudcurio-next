export default {
  async scheduled(event: ScheduledEvent, env: any, ctx: ExecutionContext) {
    console.log('Reindex cron tick at', new Date(event.scheduledTime).toISOString())
  }
}
