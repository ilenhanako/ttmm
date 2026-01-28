User Flow 1: Admin - Complete Meeting Upload & Approval Workflow
mermaidgraph TD
Start([👤 Admin Login]) --> Dashboard[View Dashboard]
Dashboard --> UploadChoice{Action?}

    UploadChoice -->|Upload New| SelectPDF[Select PDF File]
    UploadChoice -->|Review Existing| ReviewList[Go to Review Workflow]

    SelectPDF --> FillForm[Fill Meeting Details:<br/>- Title<br/>- Date/Time<br/>- Location<br/>- Attendees]
    FillForm --> ClickUpload[Click Upload]

    ClickUpload --> ShowProgress[Show Progress:<br/>'Processing...']
    ShowProgress --> AIProcess[🤖 AI Processing]

    AIProcess --> ExtractText[Python extracts text]
    ExtractText --> CreateChunks[Create 1000-char chunks]
    CreateChunks --> GenEmbed[Generate embeddings]
    GenEmbed --> ExtractTasks[LLM extracts tasks]
    ExtractTasks --> Complete[Notify: 'Ready for Review']

    Complete --> ReviewList
    ReviewList --> FilterOpt{Apply Filters?}

    FilterOpt -->|Yes| ApplyFilter[Filter by:<br/>- Department<br/>- Date Range<br/>- Status]
    FilterOpt -->|No| ViewMeeting[Select Meeting]
    ApplyFilter --> ViewMeeting

    ViewMeeting --> ViewDetails[View Meeting Details:<br/>- Metadata<br/>- PDF Preview<br/>- Pending Tasks]

    ViewDetails --> VerifyCite[Click 'Verify Citations']
    VerifyCite --> ShowHighlight[View highlighted text<br/>in PDF]
    ShowHighlight --> CheckAccuracy{Citation Accurate?}

    CheckAccuracy -->|✅ Yes| ConfirmCite[Click Confirm]
    CheckAccuracy -->|❌ No| RejectCite[Click Reject & Flag]

    ConfirmCite --> ReviewTasks[Review Pending Tasks]
    RejectCite --> ReviewTasks

    ReviewTasks --> TaskLoop[For Each Task]
    TaskLoop --> TaskAction{Admin Decision?}

    TaskAction -->|Approve as-is| ApproveTsk[✅ Approve Task]
    TaskAction -->|Edit first| EditTask[✏️ Edit Description/<br/>Deadline/Importance]
    TaskAction -->|Delete| DeleteTask[🗑️ Delete Task]
    TaskAction -->|Add new| AddManual[➕ Add Manual Task]

    EditTask --> AssignOwner[Assign/Reassign Owner]
    ApproveTsk --> AssignOwner
    AddManual --> FillManual[Fill Task Details +<br/>Link Citation]
    FillManual --> AssignOwner

    AssignOwner --> SetStatus[Set Status: 'To Do']
    SetStatus --> MoreTasks{More Tasks?}

    MoreTasks -->|Yes| TaskLoop
    MoreTasks -->|No| PublishAll[Publish All Approved]

    DeleteTask --> MoreTasks

    PublishAll --> NotifyUsers[📧 Notify Assigned Users]
    NotifyUsers --> UpdateKB[Update Knowledge Base]
    UpdateKB --> Done([✅ Complete])

    style Start fill:#e74c3c,color:#fff
    style Done fill:#2ecc71,color:#fff
    style AIProcess fill:#9b59b6,color:#fff

Key Steps:

Admin uploads PDF with meeting metadata
System processes PDF (Python → LangGraph → LLM)
Admin reviews AI-generated citations
Admin approves/edits/deletes/adds tasks
Admin assigns task owners
Users are notified of assignments
