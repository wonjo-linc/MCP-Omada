import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { OmadaClient } from '../omada/client.js';

export function registerSecurityTools(server: McpServer, client: OmadaClient) {
  server.tool(
    'omada_list_firewall_rules',
    'List ACL/firewall rules for a site.',
    {
      siteId: z.string().describe('Site ID'),
    },
    { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    async ({ siteId }) => {
      const result = await client.listFirewallRules(siteId);
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.tool(
    'omada_list_port_forwards',
    'List port forwarding rules for a site.',
    {
      siteId: z.string().describe('Site ID'),
    },
    { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    async ({ siteId }) => {
      const result = await client.listPortForwards(siteId);
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.tool(
    'omada_list_routes',
    'List static routes for a site.',
    {
      siteId: z.string().describe('Site ID'),
    },
    { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    async ({ siteId }) => {
      const result = await client.listRoutes(siteId);
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );
}
