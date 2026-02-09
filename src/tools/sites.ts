import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { OmadaClient } from '../omada/client.js';

export function registerSiteTools(server: McpServer, client: OmadaClient) {
  server.tool(
    'omada_get_controller',
    'Get Omada Controller information including version and controller ID.',
    {},
    async () => {
      const info = await client.getControllerInfo();
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(info, null, 2) }],
      };
    },
  );

  server.tool(
    'omada_list_sites',
    'List all sites managed by the Omada Controller.',
    {
      page: z.number().optional().describe('Page number (default: 1)'),
      pageSize: z.number().optional().describe('Items per page (default: 100)'),
    },
    async ({ page, pageSize }) => {
      const result = await client.listSites(page, pageSize);
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.tool(
    'omada_get_site',
    'Get detailed information about a specific site.',
    {
      siteId: z.string().describe('Site ID'),
    },
    async ({ siteId }) => {
      const result = await client.getSite(siteId);
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );
}
