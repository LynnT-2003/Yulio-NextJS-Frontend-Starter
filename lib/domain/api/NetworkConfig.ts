class NetworkConfig {
  private static instance: NetworkConfig;
  public readonly baseURL: string;

  private constructor() {
    const raw = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!raw) throw new Error('NEXT_PUBLIC_API_BASE_URL is not set');
    this.baseURL = raw.replace(/\/+$/, '');
  }

  /** POST auth/refresh on the Nest API (works if base is origin or ends with `/api`). */
  authRefreshUrl(): string {
    const base = this.baseURL;
    return base.endsWith('/api') ? `${base}/auth/refresh` : `${base}/api/auth/refresh`;
  }

  static get shared(): NetworkConfig {
    if (!NetworkConfig.instance) NetworkConfig.instance = new NetworkConfig();
    return NetworkConfig.instance;
  }
}

export default NetworkConfig;