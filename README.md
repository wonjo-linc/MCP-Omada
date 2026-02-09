# MCP-Omada

TP-Link Omada SDN Controller용 MCP (Model Context Protocol) 서버.

18개 도구로 Omada 네트워크 인프라를 관리합니다.

## 도구 목록

| 도구 | 설명 |
|------|------|
| `omada_get_controller` | 컨트롤러 정보 조회 |
| `omada_list_sites` | 사이트 목록 |
| `omada_get_site` | 사이트 상세 |
| `omada_list_devices` | 장비 목록 (AP/Switch/Gateway) |
| `omada_get_device` | 장비 상세 |
| `omada_device_action` | 장비 액션 (reboot, adopt) |
| `omada_list_clients` | 접속 클라이언트 목록 |
| `omada_get_client` | 클라이언트 상세 |
| `omada_client_action` | 클라이언트 액션 (block, unblock) |
| `omada_list_wlans` | WLAN/SSID 목록 |
| `omada_list_lans` | LAN 네트워크 목록 |
| `omada_get_wan` | WAN 설정 |
| `omada_list_firewall_rules` | 방화벽 규칙 |
| `omada_list_port_forwards` | 포트포워딩 규칙 |
| `omada_list_routes` | 정적 라우트 |
| `omada_get_statistics` | 트래픽 통계 |
| `omada_list_events` | 이벤트/알림 |
| `omada_list_logs` | 시스템 로그 |

## 사전 요구사항

Omada Controller에서 Open API Client를 생성해야 합니다:
1. Omada Controller 웹 UI > Global View > Settings > Platform Integration > Open API
2. Client 생성 → Client ID, Client Secret 복사

## 배포 (Dockge)

```yaml
services:
  mcp-omada:
    image: ghcr.io/wonjo-linc/mcp-omada:latest
    container_name: mcp-omada
    restart: unless-stopped
    ports:
      - "3102:3000"
    environment:
      - OMADA_URL=https://omada.example.com
      - OMADA_CLIENT_ID=your_client_id
      - OMADA_CLIENT_SECRET=your_client_secret
      - MCP_API_KEY=your_api_key
      - OAUTH_CLIENT_ID=your_oauth_client_id
      - OAUTH_CLIENT_SECRET=your_oauth_client_secret
      - PORT=3000
```
