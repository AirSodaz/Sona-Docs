`sona-mcp`는 Sona 데스크톱 클라이언트를 위한 Model Context Protocol (MCP) 서버 브리지이며, 공식 MCP 사양(프로토콜 버전 `2026-07-28` / MCP 2.0)을 완벽하게 준수합니다. 로컬 IPC 파이프 또는 Unix 도메인 소켓을 통해 외부 AI Agent(Claude Desktop, Cursor, OpenCode, Codex 등)를 Sona의 로컬 음성 전사 엔진, 기록 데이터베이스, 프로젝트 작업공간, 녹음 라이프사이클에 직접 연결합니다.

## 아키텍처 및 경계

`sona-mcp`는 외부 AI Agent와 로컬 Sona 호스트 간의 역할을 명확히 분리합니다:

1. **AI 추론 경계**: `sona-mcp`는 자체적으로 LLM을 호스팅하거나 추론을 직접 실행하지 않습니다. 외부 Agent는 뛰어난 대화 및 추론 능력을 기본적으로 갖추고 있습니다. 대신 `sona-mcp`는 세분화된 도구(Tools)와 컨텍스트 리소스(Resources)를 제공하여 Agent가 오디오 기록을 검사, 수정, 번역 및 요약할 수 있도록 지원합니다.
2. **무상태 프로토콜 브리지**: `sona-mcp`는 표준 입출력(`stdio`)을 통한 표준 JSON-RPC 2.0으로 외부 Agent와 통신합니다. 프로토콜 호출을 가벼운 로컬 IPC 메시지로 변환하여 실행 중인 Sona 데스크톱 애플리케이션에 전달합니다.
3. **데이터 무결성 및 버전 관리**: MCP를 통해 커밋된 모든 수정 사항(세그먼트 편집, 일괄 패치, 번역 업데이트, 요약 편집)은 Sona 데스크톱의 SQLite 저장소 내에서 불변 스냅샷 생성을 트리거하고 데스크톱 UI에 실시간 업데이트 이벤트를 브로드캐스트합니다.

```text
+-----------------------+              +-----------------------+              +-----------------------+
|    외부 AI Agent      |              |       sona-mcp        |              |   Sona 데스크톱       |
| (Claude/Cursor 등)    | <--(stdio)-> |   (프로토콜 브리지)   | <--(IPC)-->  | (ASR/DB/로컬 스토리지)|
+-----------------------+   JSON-RPC   +-----------------------+  Pipe/Socket +-----------------------+
```

## 전송 및 엔드포인트 해석

MCP 서버는 사용자 지정 엔드포인트를 지정하기 위한 선택적 명령줄 인수를 지원합니다:

```bash
sona-mcp [OPTIONS]

옵션:
      --endpoint <ENDPOINT>  사용자 지정 IPC 파이프 또는 소켓 엔드포인트
  -h, --help                 도움말 출력
  -V, --version              버전 출력
```

### 기본 IPC 엔드포인트

`--endpoint`를 명시적으로 지정하지 않으면 `sona-mcp`는 플랫폼 기본값을 자동으로 감지합니다:

- **Windows**: `\\.\pipe\sona-agent-ipc`
- **macOS / Linux**: `$XDG_RUNTIME_DIR/sona-agent.sock` (대체 경로: `~/.local/share/sona/agent.sock`)

### 오프라인 상태 및 지연 실행

Sona 데스크톱 클라이언트가 현재 실행 중이지 않을 때:

- `sona_get_client_state`는 오류 없이 `{ "online": false }`를 반환합니다.
- 데이터 수정 또는 조회 도구는 안전한 오류 메시지(`Sona desktop client is offline.`)를 반환합니다.
- 외부 Agent는 `sona_launch_desktop`(무음 백그라운드 실행 및 트레이 상주 지원)을 호출하여 데스크톱을 백그라운드에서 실행하고 IPC 연결이 수립될 때까지 폴링 대기할 수 있습니다.

## Agent 설정 예시

외부 AI Agent가 Sona를 제어할 수 있도록 하려면 Agent의 MCP 설정 파일에 `sona-mcp`를 등록합니다.

### 1. Claude Desktop

`claude_desktop_config.json`의 `mcpServers`에 설정을 추가합니다:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "sona": {
      "command": "sona-mcp",
      "args": []
    }
  }
}
```

`sona-mcp`가 시스템 `PATH`에 등록되어 있지 않은 경우, Sona 설치 디렉터리에 있는 바이너리의 절대 경로를 입력하세요.

### 2. Cursor

작업 공간 루트 또는 전역 Cursor 설정의 `.cursor/mcp.json`에 설정을 추가합니다:

```json
{
  "mcpServers": {
    "sona": {
      "command": "sona-mcp",
      "args": []
    }
  }
}
```

## 핵심 도구 목록

`sona-mcp`는 주요 기능 영역에 걸쳐 40개의 정밀 도구를 제공합니다:

### 1. 상태 및 수명 주기
- `sona_get_client_state`: 데스크톱 연결 상태, 녹음 세션 ID, 선택된 프로젝트 확인
- `sona_launch_desktop`: 백그라운드에서 Sona 데스크톱 실행 (트레이 최소화 실행 지원)

### 2. 오디오 녹음 제어
- `sona_start_recording`: 대상 프로젝트를 지정하여 실시간 녹음 시작
- `sona_stop_recording`: 현재 녹음 세션 완료 및 중지
- `sona_pause_recording`: 녹음 일시 정지
- `sona_resume_recording`: 일시 정지된 녹음 재개
- `sona_get_recording_state`: 실시간 녹음 시간, 오디오 볼륨 레벨, 세그먼트 개수 조회

### 3. 전사본 검사 및 편집
- `sona_get_transcript`: 지정된 기록 ID의 전체 세그먼트, 타임스탬프, 화자 정보 조회
- `sona_edit_transcript`: 전체 세그먼트 목록을 교체하고 불변 기록 스냅샷 저장
- `sona_patch_segments`: ID로 특정 세그먼트 정밀 수정 (텍스트, 화자, 타임스탬프)
- `sona_delete_transcript`: 전사 기록 및 연관된 오디오 파일 영구 삭제

### 4. 번역 및 요약 관리
- `sona_update_translation`: 번역된 텍스트 세그먼트 저장 및 업데이트
- `sona_edit_summary`: AI 요약 노트 및 조치 항목 편집
- `sona_delete_summary`: 특정 기록의 요약 내용 제거

### 5. 프로젝트 및 정리
- `sona_list_projects`: 모든 프로젝트 작업공간 및 포함된 항목 개수 목록 조회
- `sona_assign_project`: 전사 기록을 프로젝트로 이동하거나 받은편지함(Inbox)으로 재지정
- `sona_delete_project`: 프로젝트를 삭제하고 항목을 받은편지함 또는 휴지통으로 이동

### 6. 설정 및 시스템 진단
- `sona_get_settings`: 환경 설정, 저장 경로, 활성 모델 ID 조회
- `sona_update_settings`: 클라이언트 기본 설정 수정
- `sona_get_diagnostics`: 하드웨어 가속 상태, ASR 엔진 및 오류 로그 확인

## 컨텍스트 리소스 (`sona://`)

외부 Agent는 표준화된 `sona://` URI 스키마를 통해 실시간 컨텍스트를 직접 조회할 수 있습니다:

- `sona://client/state`: 현재 데스크톱 호스트 상태 및 활성 세션
- `sona://recording/state`: 실시간 녹음 상태, 시간, 볼륨
- `sona://projects`: 프로젝트 목록 및 메타데이터
- `sona://history/{history_id}/transcript`: 정형화된 전사 세그먼트 텍스트
- `sona://history/{history_id}/translation`: 번역 텍스트
- `sona://history/{history_id}/summary`: 생성된 AI 요약 및 실행 항목
