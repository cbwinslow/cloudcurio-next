export {};
declare global {
  const KV_VIEWS: KVNamespace;
  const DB: D1Database;
  const R2: R2Bucket;
  const R2_DOCS: R2Bucket;
  const SITE_NAME: string;
  const GITHUB_USER: string;
  const AI: any;
  const VEC: any;
  const AUDIT_PRODUCER: any;
  const AUDIT_CONSUMER: any;
  const INGEST_PRODUCER: any;
  const INGEST_CONSUMER: any;
  const HYPER: any;
}
