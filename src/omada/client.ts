import axios, { AxiosInstance } from 'axios';
import { OmadaResponse, PaginatedResult, ControllerInfo } from '../types/omada.js';

export class OmadaClient {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private omadacId: string | null = null;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private api: AxiosInstance;

  constructor(baseUrl: string, clientId: string, clientSecret: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.api = axios.create({ baseURL: this.baseUrl });
  }

  private async fetchOmadacId(): Promise<string> {
    if (this.omadacId) return this.omadacId;
    const res = await this.api.get<OmadaResponse<ControllerInfo>>('/api/info');
    if (res.data.errorCode !== 0) {
      throw new Error(`Failed to get controller info: ${res.data.msg}`);
    }
    this.omadacId = res.data.result.omadacId;
    return this.omadacId;
  }

  private async ensureAuthenticated(): Promise<void> {
    if (this.accessToken && Date.now() < this.tokenExpiry) return;

    const omadacId = await this.fetchOmadacId();
    const res = await this.api.post<
      OmadaResponse<{ accessToken: string; tokenType: string; expiresIn: number }>
    >(
      `/${omadacId}/openapi/authorize/token`,
      {
        omadacId,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
      },
    );

    if (res.data.errorCode !== 0) {
      throw new Error(`Authentication failed: ${res.data.msg}`);
    }

    this.accessToken = res.data.result.accessToken;
    this.tokenExpiry = Date.now() + (res.data.result.expiresIn - 60) * 1000;
  }

  private async request<T>(method: string, path: string, data?: unknown): Promise<T> {
    await this.ensureAuthenticated();
    const omadacId = await this.fetchOmadacId();
    const url = `/${omadacId}/openapi/v1/${omadacId}${path}`;

    const res = await this.api.request<OmadaResponse<T>>({
      method,
      url,
      data,
      headers: { Authorization: `AccessToken ${this.accessToken}` },
    });

    if (res.data.errorCode !== 0) {
      throw new Error(`Omada API error: ${res.data.msg} (code: ${res.data.errorCode})`);
    }
    return res.data.result;
  }

  // Controller
  async getControllerInfo(): Promise<ControllerInfo> {
    const res = await this.api.get<OmadaResponse<ControllerInfo>>('/api/info');
    return res.data.result;
  }

  // Sites
  async listSites(page = 1, pageSize = 100): Promise<PaginatedResult> {
    return this.request('GET', `/sites?page=${page}&pageSize=${pageSize}`);
  }

  async getSite(siteId: string): Promise<unknown> {
    return this.request('GET', `/sites/${siteId}`);
  }

  // Devices
  async listDevices(siteId: string, type?: string, page = 1, pageSize = 100): Promise<PaginatedResult> {
    let url = `/sites/${siteId}/devices?page=${page}&pageSize=${pageSize}`;
    if (type) url += `&type=${type}`;
    return this.request('GET', url);
  }

  async getDevice(siteId: string, deviceMac: string): Promise<unknown> {
    return this.request('GET', `/sites/${siteId}/devices/${deviceMac}`);
  }

  async rebootDevice(siteId: string, deviceMac: string): Promise<unknown> {
    return this.request('POST', `/sites/${siteId}/devices/${deviceMac}/reboot`);
  }

  async adoptDevice(siteId: string, deviceMac: string): Promise<unknown> {
    return this.request('POST', `/sites/${siteId}/cmd/adopts`, { macs: [deviceMac] });
  }

  // Clients
  async listClients(siteId: string, page = 1, pageSize = 100): Promise<PaginatedResult> {
    return this.request('GET', `/sites/${siteId}/clients?page=${page}&pageSize=${pageSize}`);
  }

  async getClient(siteId: string, clientMac: string): Promise<unknown> {
    return this.request('GET', `/sites/${siteId}/clients/${clientMac}`);
  }

  async blockClient(siteId: string, clientMac: string): Promise<unknown> {
    return this.request('POST', `/sites/${siteId}/clients/${clientMac}/block`);
  }

  async unblockClient(siteId: string, clientMac: string): Promise<unknown> {
    return this.request('POST', `/sites/${siteId}/clients/${clientMac}/unblock`);
  }

  // Networks
  async listWlans(siteId: string): Promise<unknown> {
    return this.request('GET', `/sites/${siteId}/setting/wlans`);
  }

  async listLans(siteId: string): Promise<unknown> {
    return this.request('GET', `/sites/${siteId}/setting/lans`);
  }

  async getWan(siteId: string): Promise<unknown> {
    return this.request('GET', `/sites/${siteId}/setting/wan`);
  }

  // Security & Routing
  async listFirewallRules(siteId: string): Promise<unknown> {
    return this.request('GET', `/sites/${siteId}/setting/firewall/acls`);
  }

  async listPortForwards(siteId: string): Promise<unknown> {
    return this.request('GET', `/sites/${siteId}/setting/firewall/portForwardings`);
  }

  async listRoutes(siteId: string): Promise<unknown> {
    return this.request('GET', `/sites/${siteId}/setting/routes`);
  }

  // Monitoring
  async getStatistics(siteId: string, type = 'hourly'): Promise<unknown> {
    return this.request('GET', `/sites/${siteId}/dashboard/overviewDiagram?type=${type}`);
  }

  async listEvents(siteId: string, page = 1, pageSize = 100): Promise<PaginatedResult> {
    return this.request('GET', `/sites/${siteId}/events?page=${page}&pageSize=${pageSize}`);
  }

  async listLogs(siteId: string, page = 1, pageSize = 100): Promise<PaginatedResult> {
    return this.request('GET', `/sites/${siteId}/logs?page=${page}&pageSize=${pageSize}`);
  }
}
