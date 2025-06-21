# Implementation Plan: Prompt Testing Application

## Project Overview
Building a single-page application for managing, versioning, and testing AI prompts across multiple language models, integrated into the existing Next.js portfolio application.

## Architecture Decision
- **Integration**: Add as new route `/prompts` in existing Next.js app
- **Database**: Extend existing Prisma schema with new models
- **Styling**: Maintain consistency with current Tailwind + custom CSS approach
- **Real-time**: Implement Server-Sent Events for streaming test results

## Phase 1: Database Schema & Core Models

### 1.1 Prisma Schema Extensions
```prisma
model Prompt {
  id             String          @id @default(cuid())
  title          String
  currentVersion Int             @default(1)
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
  versions       PromptVersion[]
  @@map("prompts")
}

model PromptVersion {
  id            String     @id @default(cuid())
  promptId      String
  versionNumber Int
  content       String     @db.Text
  variables     String[]   // JSON array of variable names
  createdAt     DateTime   @default(now())
  prompt        Prompt     @relation(fields: [promptId], references: [id], onDelete: Cascade)
  testRuns      TestRun[]
  @@unique([promptId, versionNumber])
  @@map("prompt_versions")
}

model TestRun {
  id               String         @id @default(cuid())
  promptVersionId  String
  variableValues   Json           // Object with variable name/value pairs
  createdAt        DateTime       @default(now())
  promptVersion    PromptVersion  @relation(fields: [promptVersionId], references: [id], onDelete: Cascade)
  results          TestResult[]
  @@map("test_runs")
}

model TestResult {
  id           String   @id @default(cuid())
  testRunId    String
  model        String   // e.g., "gpt-4", "claude-3"
  output       String   @db.Text
  responseTime Int      // milliseconds
  passed       Boolean? // null = not evaluated, true/false = user evaluation
  createdAt    DateTime @default(now())
  testRun      TestRun  @relation(fields: [testRunId], references: [id], onDelete: Cascade)
  @@map("test_results")
}
```

### 1.2 API Route Structure
```
/api/prompts/
├── route.ts                 # GET (list), POST (create)
├── [id]/
│   ├── route.ts            # GET, PUT, DELETE
│   ├── versions/
│   │   └── route.ts        # GET versions, POST new version
│   └── test/
│       └── route.ts        # POST - start test run
├── test-runs/
│   └── [id]/
│       ├── route.ts        # GET test run details
│       └── results/
│           └── route.ts    # GET, PUT (update pass/fail)
└── models/
    └── route.ts            # GET available models & presets
```

## Phase 2: Core Functionality Implementation

### 2.1 Prompt Management System
- **Priority**: High
- **Components**:
  - `PromptList` - Grid/list view of all prompts
  - `PromptCard` - Individual prompt display
  - `PromptEditor` - Text editor with variable detection
  - `VersionSelector` - Dropdown for version management

### 2.2 Variable Detection System
- **Priority**: High
- **Implementation**:
  - Real-time regex parsing of `{variable}` syntax
  - Client-side validation and extraction
  - Auto-update variable list on content changes

### 2.3 Model Integration Layer
- **Priority**: High
- **Initial Models**:
  - OpenAI (GPT-3.5, GPT-4)
  - Anthropic (Claude variants)
  - Local/Ollama integration (if needed)
- **Preset Groups**:
  - "Local": Local models only
  - "Cheap": GPT-3.5, Claude Haiku
  - "Value": GPT-4, Claude Sonnet
  - "Expensive": GPT-4 Turbo, Claude Opus
  - "All": All available models

## Phase 3: Testing System

### 3.1 Test Configuration UI
- **Components**:
  - `ModelSelector` - Checkbox list with presets
  - `VariableForm` - Dynamic form for variable inputs
  - `TestRunner` - Orchestrates test execution

### 3.2 Real-time Results Display
- **Implementation**: Server-Sent Events
- **Components**:
  - `TestResults` - Progress tracking and result display
  - `ResultCard` - Individual model result with pass/fail
  - `ProgressIndicator` - Overall test progress

### 3.3 Test History
- **Components**:
  - `TestHistory` - Table view of past tests
  - `TestDetails` - Detailed view of specific test run

## Phase 4: UI/UX Implementation

### 4.1 Layout Structure
```
/prompts/
├── page.tsx                 # Home - prompt list
├── create/
│   └── page.tsx            # Create new prompt
├── [id]/
│   ├── page.tsx            # Prompt detail/editor
│   ├── test/
│   │   └── page.tsx        # Test configuration
│   ├── results/
│   │   └── [runId]/
│   │       └── page.tsx    # Test results
│   └── history/
│       └── page.tsx        # Test history
└── components/
    ├── PromptList.tsx
    ├── PromptEditor.tsx
    ├── ModelSelector.tsx
    ├── TestRunner.tsx
    └── TestResults.tsx
```

### 4.2 Navigation Integration
- Add "Prompts" link to existing Navbar
- Maintain consistent styling with current design
- Search functionality in top navigation

## Phase 5: Advanced Features

### 5.1 Search and Filtering
- **Priority**: Medium
- Full-text search across prompt content
- Filter by date, version, test status

### 5.2 Export/Import
- **Priority**: Low
- JSON export of prompts and test data
- Import functionality for migration

### 5.3 Performance Optimizations
- **Priority**: Medium
- Pagination for large prompt lists
- Lazy loading of test results
- Caching strategies for frequent queries

## Implementation Timeline

**Week 1**: Database schema, core API routes, basic CRUD
**Week 2**: Prompt editor, variable detection, version management
**Week 3**: Model integration, test runner, basic results display
**Week 4**: Real-time updates, test history, UI polish
**Week 5**: Search, filtering, performance optimization

## Technical Considerations

### Security
- API key management for external models
- Rate limiting for test execution
- Input validation and sanitization

### Performance
- Async test execution with queuing
- Result streaming for large tests
- Database indexing for search performance

### Scalability
- Modular model provider system
- Configurable test concurrency limits
- Efficient database queries with proper relations

## Questions for Clarification

1. **Authentication**: Should users be able to share prompts, or is this single-user for now?
2. **Model APIs**: Which specific model providers should be prioritized?
3. **Local Models**: Any specific local model integration requirements?
4. **Deployment**: Any specific considerations for your existing Docker setup?

## Success Criteria

- ✅ Create, edit, and version prompts
- ✅ Test prompts across multiple models simultaneously
- ✅ Real-time result streaming
- ✅ Pass/fail evaluation and history tracking
- ✅ Search and filter functionality
- ✅ Responsive design matching existing portfolio style