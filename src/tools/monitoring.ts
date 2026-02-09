import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { OmadaClient } from '../omada/client.js';

export function registerMonitoringTools(server: McpServer, client: OmadaClient) {
  server.tool(
    'omada_get_statistics',
    'Get traffic statistics for a site dashboard.',
    {
      siteId: z.string().describe('Site ID'),
      type: z
        .enum(['5min', 'hourly', 'daily'])
        .optional()
        .describe('Statistics granularity (default: "hourly")'),
    },
    async ({ siteId, type }) => {
      const result = await client.getStatistics(siteId, type);
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.tool(
    'omada_list_events',
    'List events and alerts for a site.',
    {
      siteId: z.string().describe('Site ID'),
      page: z.number().optional().describe('Page number (default: 1)'),
      pageSize: z.number().optional().describe('Items per page (default: 100)'),
    },
    async ({ siteId, page, pageSize }) => {
      const result = await client.listEvents(siteId, page, pageSize);
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.tool(
    'omada_list_logs',
    'List system logs for a site.',
    {
      siteId: z.string().describe('Site ID'),
      page: z.number().optional().describe('Page number (default: 1)'),
      pageSize: z.number().optional().describe('Items per page (default: 100)'),
    },
    async ({ siteId, page, pageSize }) => {
      const result = await client.listLogs(siteId, page, pageSize);
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );
}
