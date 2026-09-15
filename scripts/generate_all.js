const fs = require('fs');
const path = require('path');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Write .gitignore
fs.writeFileSync(path.join(__dirname, '..', '.gitignore'), `# Dependencies
node_modules/
dist/
dist-ssr/
*.local

# Environment & Secrets
.env
.env.*
!.env.example
*.pem
*.key
*.cert

# Salesforce DX
.sfdx/
.sf/
.salesforce/
.localdevserver/

# Logs & Temp
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*
.DS_Store
Thumbs.db
coverage/

# IDE & Editor
.vscode/*
!.vscode/settings.json
!.vscode/launch.json
!.vscode/extensions.json
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`);

// Write .forceignore
fs.writeFileSync(path.join(__dirname, '..', '.forceignore'), `# List files or directories below to not include when deploying to Salesforce
target/
.sfdx/
.sf/
.git/
.gitignore
.env
node_modules/
dist/
src/
public/
package.json
package-lock.json
vite.config.ts
tsconfig.json
tsconfig.node.json
index.html
README.md
scripts/
`);

// Write sfdx-project.json
fs.writeFileSync(path.join(__dirname, '..', 'sfdx-project.json'), JSON.stringify({
  packageDirectories: [
    {
      path: "force-app",
      default: true
    }
  ],
  name: "Salesforce-Employee-Leave-HR-Management",
  namespace: "",
  sfdcLoginUrl: "https://login.salesforce.com",
  sourceApiVersion: "61.0"
}, null, 2));

const baseDir = path.join(__dirname, '..', 'force-app', 'main', 'default');

// 1. OBJECTS - Employee__c
const empObjDir = path.join(baseDir, 'objects', 'Employee__c');
const empFieldsDir = path.join(empObjDir, 'fields');
ensureDir(empFieldsDir);

fs.writeFileSync(path.join(empObjDir, 'Employee__c.object-meta.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<CustomObject xmlns="http://soap.sforce.com/2006/04/metadata">
    <actionOverrides>
        <actionName>Accept</actionName>
        <type>Default</type>
    </actionOverrides>
    <actionOverrides>
        <actionName>CancelEdit</actionName>
        <type>Default</type>
    </actionOverrides>
    <actionOverrides>
        <actionName>Clone</actionName>
        <type>Default</type>
    </actionOverrides>
    <actionOverrides>
        <actionName>Delete</actionName>
        <type>Default</type>
    </actionOverrides>
    <actionOverrides>
        <actionName>Edit</actionName>
        <type>Default</type>
    </actionOverrides>
    <actionOverrides>
        <actionName>List</actionName>
        <type>Default</type>
    </actionOverrides>
    <actionOverrides>
        <actionName>New</actionName>
        <type>Default</type>
    </actionOverrides>
    <actionOverrides>
        <actionName>SaveEdit</actionName>
        <type>Default</type>
    </actionOverrides>
    <actionOverrides>
        <actionName>Tab</actionName>
        <type>Default</type>
    </actionOverrides>
    <actionOverrides>
        <actionName>View</actionName>
        <type>Default</type>
    </actionOverrides>
    <allowInChatterGroups>false</allowInChatterGroups>
    <compactLayoutAssignment>SYSTEM</compactLayoutAssignment>
    <deploymentStatus>Deployed</deploymentStatus>
    <description>Stores employee profile records and tracking of annual leave balances.</description>
    <enableActivities>true</enableActivities>
    <enableBulkApi>true</enableBulkApi>
    <enableFeeds>false</enableFeeds>
    <enableHistory>true</enableHistory>
    <enableLicensing>false</enableLicensing>
    <enableReports>true</enableReports>
    <enableSearch>true</enableSearch>
    <enableSharing>true</enableSharing>
    <enableStreamingApi>true</enableStreamingApi>
    <label>Employee</label>
    <nameField>
        <label>Employee Name</label>
        <trackHistory>false</trackHistory>
        <type>Text</type>
    </nameField>
    <pluralLabel>Employees</pluralLabel>
    <sharingModel>ReadWrite</sharingModel>
    <visibility>Public</visibility>
</CustomObject>
`);

const empFields = [
  {
    name: 'Employee_ID__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Employee_ID__c</fullName>
    <caseSensitive>false</caseSensitive>
    <description>Unique organizational identifier for the employee.</description>
    <externalId>true</externalId>
    <inlineHelpText>Enter unique Employee ID (e.g., EMP-1001).</inlineHelpText>
    <label>Employee ID</label>
    <length>20</length>
    <required>true</required>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Text</type>
    <unique>true</unique>
</CustomField>`
  },
  {
    name: 'Email__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Email__c</fullName>
    <description>Official work email address used for notifications.</description>
    <externalId>false</externalId>
    <label>Work Email</label>
    <required>true</required>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Email</type>
    <unique>false</unique>
</CustomField>`
  },
  {
    name: 'Department__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Department__c</fullName>
    <description>Employee functional department.</description>
    <externalId>false</externalId>
    <label>Department</label>
    <required>true</required>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Picklist</type>
    <valueSet>
        <restricted>true</restricted>
        <valueSetDefinition>
            <sorted>false</sorted>
            <value><fullName>Engineering</fullName><default>true</default><label>Engineering</label></value>
            <value><fullName>HR</fullName><default>false</default><label>HR</label></value>
            <value><fullName>Finance</fullName><default>false</default><label>Finance</label></value>
            <value><fullName>Marketing</fullName><default>false</default><label>Marketing</label></value>
            <value><fullName>Sales</fullName><default>false</default><label>Sales</label></value>
            <value><fullName>Operations</fullName><default>false</default><label>Operations</label></value>
        </valueSetDefinition>
    </valueSet>
</CustomField>`
  },
  {
    name: 'Designation__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Designation__c</fullName>
    <description>Job title and organizational role.</description>
    <externalId>false</externalId>
    <label>Designation</label>
    <length>100</length>
    <required>false</required>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Text</type>
    <unique>false</unique>
</CustomField>`
  },
  {
    name: 'Manager__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Manager__c</fullName>
    <deleteConstraint>SetNull</deleteConstraint>
    <description>Direct reporting line manager responsible for first-level leave approval.</description>
    <externalId>false</externalId>
    <label>Manager</label>
    <referenceTo>Employee__c</referenceTo>
    <relationshipLabel>Direct Reports</relationshipLabel>
    <relationshipName>Direct_Reports</relationshipName>
    <required>false</required>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Lookup</type>
</CustomField>`
  },
  {
    name: 'Joining_Date__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Joining_Date__c</fullName>
    <description>Date the employee commenced employment.</description>
    <externalId>false</externalId>
    <label>Joining Date</label>
    <required>false</required>
    <trackHistory>false</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Date</type>
</CustomField>`
  },
  {
    name: 'Employment_Status__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Employment_Status__c</fullName>
    <description>Current employment lifecycle status.</description>
    <externalId>false</externalId>
    <label>Employment Status</label>
    <required>true</required>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Picklist</type>
    <valueSet>
        <restricted>true</restricted>
        <valueSetDefinition>
            <sorted>false</sorted>
            <value><fullName>Active</fullName><default>true</default><label>Active</label></value>
            <value><fullName>On Leave</fullName><default>false</default><label>On Leave</label></value>
            <value><fullName>Resigned</fullName><default>false</default><label>Resigned</label></value>
            <value><fullName>Terminated</fullName><default>false</default><label>Terminated</label></value>
        </valueSetDefinition>
    </valueSet>
</CustomField>`
  },
  {
    name: 'Total_Casual_Leave__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Total_Casual_Leave__c</fullName>
    <defaultValue>12</defaultValue>
    <description>Total allocated annual casual leave quota.</description>
    <externalId>false</externalId>
    <label>Total Casual Leave</label>
    <precision>4</precision>
    <required>false</required>
    <scale>0</scale>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Number</type>
    <unique>false</unique>
</CustomField>`
  },
  {
    name: 'Used_Casual_Leave__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Used_Casual_Leave__c</fullName>
    <defaultValue>0</defaultValue>
    <description>Casual leave days consumed year-to-date upon final approval.</description>
    <externalId>false</externalId>
    <label>Used Casual Leave</label>
    <precision>4</precision>
    <required>false</required>
    <scale>0</scale>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Number</type>
    <unique>false</unique>
</CustomField>`
  },
  {
    name: 'Remaining_Casual_Leave__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Remaining_Casual_Leave__c</fullName>
    <description>Calculated available casual leave balance.</description>
    <externalId>false</externalId>
    <formula>BLANKVALUE(Total_Casual_Leave__c, 0) - BLANKVALUE(Used_Casual_Leave__c, 0)</formula>
    <formulaTreatBlanksAs>BlankAsZero</formulaTreatBlanksAs>
    <label>Remaining Casual Leave</label>
    <precision>18</precision>
    <required>false</required>
    <scale>0</scale>
    <trackHistory>false</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Number</type>
    <unique>false</unique>
</CustomField>`
  },
  {
    name: 'Total_Sick_Leave__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Total_Sick_Leave__c</fullName>
    <defaultValue>10</defaultValue>
    <description>Total allocated annual sick leave quota.</description>
    <externalId>false</externalId>
    <label>Total Sick Leave</label>
    <precision>4</precision>
    <required>false</required>
    <scale>0</scale>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Number</type>
    <unique>false</unique>
</CustomField>`
  },
  {
    name: 'Used_Sick_Leave__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Used_Sick_Leave__c</fullName>
    <defaultValue>0</defaultValue>
    <description>Sick leave days consumed year-to-date upon final approval.</description>
    <externalId>false</externalId>
    <label>Used Sick Leave</label>
    <precision>4</precision>
    <required>false</required>
    <scale>0</scale>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Number</type>
    <unique>false</unique>
</CustomField>`
  },
  {
    name: 'Remaining_Sick_Leave__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Remaining_Sick_Leave__c</fullName>
    <description>Calculated available sick leave balance.</description>
    <externalId>false</externalId>
    <formula>BLANKVALUE(Total_Sick_Leave__c, 0) - BLANKVALUE(Used_Sick_Leave__c, 0)</formula>
    <formulaTreatBlanksAs>BlankAsZero</formulaTreatBlanksAs>
    <label>Remaining Sick Leave</label>
    <precision>18</precision>
    <required>false</required>
    <scale>0</scale>
    <trackHistory>false</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Number</type>
    <unique>false</unique>
</CustomField>`
  },
  {
    name: 'Total_Earned_Leave__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Total_Earned_Leave__c</fullName>
    <defaultValue>15</defaultValue>
    <description>Total allocated annual earned/privileged leave quota.</description>
    <externalId>false</externalId>
    <label>Total Earned Leave</label>
    <precision>4</precision>
    <required>false</required>
    <scale>0</scale>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Number</type>
    <unique>false</unique>
</CustomField>`
  },
  {
    name: 'Used_Earned_Leave__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Used_Earned_Leave__c</fullName>
    <defaultValue>0</defaultValue>
    <description>Earned leave days consumed year-to-date upon final approval.</description>
    <externalId>false</externalId>
    <label>Used Earned Leave</label>
    <precision>4</precision>
    <required>false</required>
    <scale>0</scale>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Number</type>
    <unique>false</unique>
</CustomField>`
  },
  {
    name: 'Remaining_Earned_Leave__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Remaining_Earned_Leave__c</fullName>
    <description>Calculated available earned leave balance.</description>
    <formula>BLANKVALUE(Total_Earned_Leave__c, 0) - BLANKVALUE(Used_Earned_Leave__c, 0)</formula>
    <formulaTreatBlanksAs>BlankAsZero</formulaTreatBlanksAs>
    <label>Remaining Earned Leave</label>
    <precision>18</precision>
    <required>false</required>
    <scale>0</scale>
    <trackHistory>false</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Number</type>
    <unique>false</unique>
</CustomField>`
  }
];

empFields.forEach(f => {
  fs.writeFileSync(path.join(empFieldsDir, f.name + '.field-meta.xml'), f.xml);
});

// 2. OBJECTS - Leave_Request__c
const lrObjDir = path.join(baseDir, 'objects', 'Leave_Request__c');
const lrFieldsDir = path.join(lrObjDir, 'fields');
const lrVrDir = path.join(lrObjDir, 'validationRules');
ensureDir(lrFieldsDir);
ensureDir(lrVrDir);

fs.writeFileSync(path.join(lrObjDir, 'Leave_Request__c.object-meta.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<CustomObject xmlns="http://soap.sforce.com/2006/04/metadata">
    <actionOverrides>
        <actionName>Accept</actionName>
        <type>Default</type>
    </actionOverrides>
    <actionOverrides>
        <actionName>CancelEdit</actionName>
        <type>Default</type>
    </actionOverrides>
    <actionOverrides>
        <actionName>Clone</actionName>
        <type>Default</type>
    </actionOverrides>
    <actionOverrides>
        <actionName>Delete</actionName>
        <type>Default</type>
    </actionOverrides>
    <actionOverrides>
        <actionName>Edit</actionName>
        <type>Default</type>
    </actionOverrides>
    <actionOverrides>
        <actionName>List</actionName>
        <type>Default</type>
    </actionOverrides>
    <actionOverrides>
        <actionName>New</actionName>
        <type>Default</type>
    </actionOverrides>
    <actionOverrides>
        <actionName>SaveEdit</actionName>
        <type>Default</type>
    </actionOverrides>
    <actionOverrides>
        <actionName>Tab</actionName>
        <type>Default</type>
    </actionOverrides>
    <actionOverrides>
        <actionName>View</actionName>
        <type>Default</type>
    </actionOverrides>
    <allowInChatterGroups>true</allowInChatterGroups>
    <compactLayoutAssignment>SYSTEM</compactLayoutAssignment>
    <deploymentStatus>Deployed</deploymentStatus>
    <description>Stores leave requests submitted by employees with multi-level approval tracking.</description>
    <enableActivities>true</enableActivities>
    <enableBulkApi>true</enableBulkApi>
    <enableFeeds>false</enableFeeds>
    <enableHistory>true</enableHistory>
    <enableLicensing>false</enableLicensing>
    <enableReports>true</enableReports>
    <enableSearch>true</enableSearch>
    <enableSharing>true</enableSharing>
    <enableStreamingApi>true</enableStreamingApi>
    <label>Leave Request</label>
    <nameField>
        <displayFormat>LR-{00000}</displayFormat>
        <label>Leave Request ID</label>
        <type>AutoNumber</type>
    </nameField>
    <pluralLabel>Leave Requests</pluralLabel>
    <sharingModel>ReadWrite</sharingModel>
    <visibility>Public</visibility>
</CustomObject>
`);

const lrFields = [
  {
    name: 'Employee__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Employee__c</fullName>
    <deleteConstraint>Restrict</deleteConstraint>
    <description>The employee requesting the leave.</description>
    <externalId>false</externalId>
    <label>Employee</label>
    <referenceTo>Employee__c</referenceTo>
    <relationshipLabel>Leave Requests</relationshipLabel>
    <relationshipName>Leave_Requests</relationshipName>
    <required>true</required>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Lookup</type>
</CustomField>`
  },
  {
    name: 'Leave_Type__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Leave_Type__c</fullName>
    <description>Category of leave requested.</description>
    <externalId>false</externalId>
    <label>Leave Type</label>
    <required>true</required>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Picklist</type>
    <valueSet>
        <restricted>true</restricted>
        <valueSetDefinition>
            <sorted>false</sorted>
            <value><fullName>Casual Leave</fullName><default>true</default><label>Casual Leave</label></value>
            <value><fullName>Sick Leave</fullName><default>false</default><label>Sick Leave</label></value>
            <value><fullName>Earned Leave</fullName><default>false</default><label>Earned Leave</label></value>
            <value><fullName>Emergency Leave</fullName><default>false</default><label>Emergency Leave</label></value>
            <value><fullName>Unpaid Leave</fullName><default>false</default><label>Unpaid Leave</label></value>
        </valueSetDefinition>
    </valueSet>
</CustomField>`
  },
  {
    name: 'Start_Date__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Start_Date__c</fullName>
    <description>First day of leave period.</description>
    <externalId>false</externalId>
    <label>Start Date</label>
    <required>true</required>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Date</type>
</CustomField>`
  },
  {
    name: 'End_Date__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>End_Date__c</fullName>
    <description>Final day of leave period.</description>
    <externalId>false</externalId>
    <label>End Date</label>
    <required>true</required>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Date</type>
</CustomField>`
  },
  {
    name: 'Leave_Days__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Leave_Days__c</fullName>
    <description>Calculated number of calendar days of leave requested (inclusive).</description>
    <externalId>false</externalId>
    <formula>IF(AND(NOT(ISBLANK(Start_Date__c)), NOT(ISBLANK(End_Date__c))), End_Date__c - Start_Date__c + 1, 0)</formula>
    <formulaTreatBlanksAs>BlankAsZero</formulaTreatBlanksAs>
    <label>Leave Days</label>
    <precision>18</precision>
    <required>false</required>
    <scale>0</scale>
    <trackHistory>false</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Number</type>
    <unique>false</unique>
</CustomField>`
  },
  {
    name: 'Reason__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Reason__c</fullName>
    <description>Employee explanation or context for the requested leave.</description>
    <externalId>false</externalId>
    <label>Reason</label>
    <length>1000</length>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>LongTextArea</type>
    <visibleLines>3</visibleLines>
</CustomField>`
  },
  {
    name: 'Status__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Status__c</fullName>
    <description>Current stage of the leave approval lifecycle.</description>
    <externalId>false</externalId>
    <label>Status</label>
    <required>true</required>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Picklist</type>
    <valueSet>
        <restricted>true</restricted>
        <valueSetDefinition>
            <sorted>false</sorted>
            <value><fullName>Draft</fullName><default>false</default><label>Draft</label></value>
            <value><fullName>Submitted</fullName><default>true</default><label>Submitted</label></value>
            <value><fullName>Manager Approved</fullName><default>false</default><label>Manager Approved</label></value>
            <value><fullName>HR Approved</fullName><default>false</default><label>HR Approved</label></value>
            <value><fullName>Final Approved</fullName><default>false</default><label>Final Approved</label></value>
            <value><fullName>Rejected</fullName><default>false</default><label>Rejected</label></value>
            <value><fullName>Cancelled</fullName><default>false</default><label>Cancelled</label></value>
        </valueSetDefinition>
    </valueSet>
</CustomField>`
  },
  {
    name: 'Manager_Comments__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Manager_Comments__c</fullName>
    <description>Remarks or rationale entered by the reporting manager during review.</description>
    <externalId>false</externalId>
    <label>Manager Comments</label>
    <length>255</length>
    <required>false</required>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Text</type>
    <unique>false</unique>
</CustomField>`
  },
  {
    name: 'HR_Comments__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>HR_Comments__c</fullName>
    <description>Remarks entered by HR reviewer.</description>
    <externalId>false</externalId>
    <label>HR Comments</label>
    <length>255</length>
    <required>false</required>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Text</type>
    <unique>false</unique>
</CustomField>`
  },
  {
    name: 'Final_Approval_Comments__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Final_Approval_Comments__c</fullName>
    <description>Remarks entered by department head / final approver.</description>
    <externalId>false</externalId>
    <label>Final Approval Comments</label>
    <length>255</length>
    <required>false</required>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Text</type>
    <unique>false</unique>
</CustomField>`
  },
  {
    name: 'Submitted_Date__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Submitted_Date__c</fullName>
    <description>Timestamp when request was formally submitted for approval.</description>
    <externalId>false</externalId>
    <label>Submitted Date</label>
    <required>false</required>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>DateTime</type>
</CustomField>`
  },
  {
    name: 'Approved_Date__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Approved_Date__c</fullName>
    <description>Timestamp when final approval was granted.</description>
    <externalId>false</externalId>
    <label>Approved Date</label>
    <required>false</required>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>DateTime</type>
</CustomField>`
  },
  {
    name: 'Rejection_Reason__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Rejection_Reason__c</fullName>
    <description>Mandatory justification provided if the request is rejected.</description>
    <externalId>false</externalId>
    <label>Rejection Reason</label>
    <length>255</length>
    <required>false</required>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Text</type>
    <unique>false</unique>
</CustomField>`
  },
  {
    name: 'Approval_Level__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Approval_Level__c</fullName>
    <description>Identifies the active reviewing tier based on duration conditional routing.</description>
    <externalId>false</externalId>
    <label>Current Approval Level</label>
    <required>false</required>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Picklist</type>
    <valueSet>
        <restricted>true</restricted>
        <valueSetDefinition>
            <sorted>false</sorted>
            <value><fullName>Manager</fullName><default>true</default><label>Manager</label></value>
            <value><fullName>HR</fullName><default>false</default><label>HR</label></value>
            <value><fullName>Final Approver</fullName><default>false</default><label>Final Approver</label></value>
            <value><fullName>None</fullName><default>false</default><label>None</label></value>
        </valueSetDefinition>
    </valueSet>
</CustomField>`
  },
  {
    name: 'Is_Finalized__c',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Is_Finalized__c</fullName>
    <defaultValue>false</defaultValue>
    <description>System flag locked after Final Approval or Rejection to prevent tampering.</description>
    <externalId>false</externalId>
    <label>Is Finalized</label>
    <trackHistory>true</trackHistory>
    <trackTrending>false</trackTrending>
    <type>Checkbox</type>
</CustomField>`
  }
];

lrFields.forEach(f => {
  fs.writeFileSync(path.join(lrFieldsDir, f.name + '.field-meta.xml'), f.xml);
});

// Validation Rules
const vrs = [
  {
    name: 'VR_End_Date_Before_Start_Date',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<ValidationRule xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>VR_End_Date_Before_Start_Date</fullName>
    <active>true</active>
    <description>Ensures end date is on or after start date.</description>
    <errorConditionFormula>End_Date__c &lt; Start_Date__c</errorConditionFormula>
    <errorDisplayField>End_Date__c</errorDisplayField>
    <errorMessage>End Date cannot be earlier than Start Date. Please select a valid date range.</errorMessage>
</ValidationRule>`
  },
  {
    name: 'VR_Reason_Required',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<ValidationRule xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>VR_Reason_Required</fullName>
    <active>true</active>
    <description>Requires employee to provide context for their time off.</description>
    <errorConditionFormula>ISBLANK(TRIM(Reason__c))</errorConditionFormula>
    <errorDisplayField>Reason__c</errorDisplayField>
    <errorMessage>Please provide a brief reason for your leave request so your manager can review it.</errorMessage>
</ValidationRule>`
  },
  {
    name: 'VR_Employee_Required',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<ValidationRule xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>VR_Employee_Required</fullName>
    <active>true</active>
    <description>Ensures leave request is linked to a valid employee record.</description>
    <errorConditionFormula>ISBLANK(Employee__c)</errorConditionFormula>
    <errorDisplayField>Employee__c</errorDisplayField>
    <errorMessage>Please select the employee record requesting time off.</errorMessage>
</ValidationRule>`
  },
  {
    name: 'VR_Prevent_Edit_After_Finalization',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<ValidationRule xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>VR_Prevent_Edit_After_Finalization</fullName>
    <active>true</active>
    <description>Prevents unauthorized modifications to leave requests that have reached final decision status.</description>
    <errorConditionFormula>PRIORVALUE(Is_Finalized__c) = TRUE &amp;&amp; NOT(ISCHANGED(Is_Finalized__c))</errorConditionFormula>
    <errorMessage>This leave request has already been finalized and cannot be modified. If your plans change, please submit a new request.</errorMessage>
</ValidationRule>`
  }
];

vrs.forEach(vr => {
  fs.writeFileSync(path.join(lrVrDir, vr.name + '.validationRule-meta.xml'), vr.xml);
});

// 3. CUSTOM TABS
const tabsDir = path.join(baseDir, 'tabs');
ensureDir(tabsDir);

fs.writeFileSync(path.join(tabsDir, 'Employee__c.tab-meta.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<CustomTab xmlns="http://soap.sforce.com/2006/04/metadata">
    <customObject>true</customObject>
    <description>Tab for managing Employee profiles and leave quotas.</description>
    <motif>Custom84: Presenter</motif>
</CustomTab>
`);

fs.writeFileSync(path.join(tabsDir, 'Leave_Request__c.tab-meta.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<CustomTab xmlns="http://soap.sforce.com/2006/04/metadata">
    <customObject>true</customObject>
    <description>Tab for submitting and reviewing employee leave requests.</description>
    <motif>Custom25: Alarm clock</motif>
</CustomTab>
`);

// 4. FLOWS
const flowsDir = path.join(baseDir, 'flows');
ensureDir(flowsDir);

// Screen Flow: FLW_Leave_Request_Submission
fs.writeFileSync(path.join(flowsDir, 'FLW_Leave_Request_Submission.flow-meta.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<Flow xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>61.0</apiVersion>
    <description>Interactive Screen Flow for employees to submit leave requests with real-time balance checks and automatic duration calculation.</description>
    <environments>Default</environments>
    <interviewLabel>Leave Request Submission Flow {!$Flow.CurrentDateTime}</interviewLabel>
    <label>FLW_Leave_Request_Submission</label>
    <processMetadataValues>
        <name>BuilderType</name>
        <value><stringValue>LightningFlowBuilder</stringValue></value>
    </processMetadataValues>
    <processType>Flow</processType>
    <screens>
        <name>Leave_Request_Form</name>
        <label>Request Time Off</label>
        <locationX>176</locationX>
        <locationY>158</locationY>
        <allowBack>false</allowBack>
        <allowFinish>true</allowFinish>
        <allowPause>false</allowPause>
        <connector>
            <targetReference>Create_Leave_Request</targetReference>
        </connector>
        <fields>
            <name>Header_Text</name>
            <fieldText>&lt;p&gt;&lt;strong style="font-size: 16px; color: #252525;"&gt;New Leave Request&lt;/strong&gt;&lt;/p&gt;&lt;p style="color: #6F6A64;"&gt;Submit your time-off request for review and automatic balance calculation.&lt;/p&gt;</fieldText>
            <fieldType>DisplayText</fieldType>
        </fields>
        <fields>
            <name>Input_Employee</name>
            <dataType>String</dataType>
            <fieldText>Employee ID</fieldText>
            <fieldType>InputField</fieldType>
            <isRequired>true</isRequired>
        </fields>
        <fields>
            <name>Input_Leave_Type</name>
            <choiceReferences>Choice_Casual</choiceReferences>
            <choiceReferences>Choice_Sick</choiceReferences>
            <choiceReferences>Choice_Earned</choiceReferences>
            <choiceReferences>Choice_Emergency</choiceReferences>
            <choiceReferences>Choice_Unpaid</choiceReferences>
            <dataType>String</dataType>
            <fieldText>Leave Type</fieldText>
            <fieldType>DropdownBox</fieldType>
            <isRequired>true</isRequired>
        </fields>
        <fields>
            <name>Input_Start_Date</name>
            <dataType>Date</dataType>
            <fieldText>Start Date</fieldText>
            <fieldType>InputField</fieldType>
            <isRequired>true</isRequired>
        </fields>
        <fields>
            <name>Input_End_Date</name>
            <dataType>Date</dataType>
            <fieldText>End Date</fieldText>
            <fieldType>InputField</fieldType>
            <isRequired>true</isRequired>
        </fields>
        <fields>
            <name>Input_Reason</name>
            <fieldText>Reason for Leave</fieldText>
            <fieldType>LargeTextArea</fieldType>
            <isRequired>true</isRequired>
        </fields>
        <showFooter>true</showFooter>
        <showHeader>true</showHeader>
    </screens>
    <choices>
        <name>Choice_Casual</name>
        <choiceText>Casual Leave</choiceText>
        <dataType>String</dataType>
        <value><stringValue>Casual Leave</stringValue></value>
    </choices>
    <choices>
        <name>Choice_Sick</name>
        <choiceText>Sick Leave</choiceText>
        <dataType>String</dataType>
        <value><stringValue>Sick Leave</stringValue></value>
    </choices>
    <choices>
        <name>Choice_Earned</name>
        <choiceText>Earned Leave</choiceText>
        <dataType>String</dataType>
        <value><stringValue>Earned Leave</stringValue></value>
    </choices>
    <choices>
        <name>Choice_Emergency</name>
        <choiceText>Emergency Leave</choiceText>
        <dataType>String</dataType>
        <value><stringValue>Emergency Leave</stringValue></value>
    </choices>
    <choices>
        <name>Choice_Unpaid</name>
        <choiceText>Unpaid Leave</choiceText>
        <dataType>String</dataType>
        <value><stringValue>Unpaid Leave</stringValue></value>
    </choices>
    <recordCreates>
        <name>Create_Leave_Request</name>
        <label>Create Leave Request</label>
        <locationX>176</locationX>
        <locationY>278</locationY>
        <connector>
            <targetReference>Success_Screen</targetReference>
        </connector>
        <inputAssignments>
            <field>Employee__c</field>
            <value><elementReference>Input_Employee</elementReference></value>
        </inputAssignments>
        <inputAssignments>
            <field>Leave_Type__c</field>
            <value><elementReference>Input_Leave_Type</elementReference></value>
        </inputAssignments>
        <inputAssignments>
            <field>Start_Date__c</field>
            <value><elementReference>Input_Start_Date</elementReference></value>
        </inputAssignments>
        <inputAssignments>
            <field>End_Date__c</field>
            <value><elementReference>Input_End_Date</elementReference></value>
        </inputAssignments>
        <inputAssignments>
            <field>Reason__c</field>
            <value><elementReference>Input_Reason</elementReference></value>
        </inputAssignments>
        <inputAssignments>
            <field>Status__c</field>
            <value><stringValue>Submitted</stringValue></value>
        </inputAssignments>
        <inputAssignments>
            <field>Approval_Level__c</field>
            <value><stringValue>Manager</stringValue></value>
        </inputAssignments>
        <inputAssignments>
            <field>Submitted_Date__c</field>
            <value><elementReference>$Flow.CurrentDateTime</elementReference></value>
        </inputAssignments>
        <object>Leave_Request__c</object>
    </recordCreates>
    <screens>
        <name>Success_Screen</name>
        <label>Request Submitted</label>
        <locationX>176</locationX>
        <locationY>398</locationY>
        <allowBack>false</allowBack>
        <allowFinish>true</allowFinish>
        <allowPause>false</allowPause>
        <fields>
            <name>Success_Message</name>
            <fieldText>&lt;p style="color: #718C72; font-weight: bold; font-size: 16px;"&gt;✓ Your leave request has been submitted successfully.&lt;/p&gt;&lt;p style="color: #6F6A64;"&gt;Your manager has been notified for initial review. You can track progress in your Leave History.&lt;/p&gt;</fieldText>
            <fieldType>DisplayText</fieldType>
        </fields>
        <showFooter>true</showFooter>
        <showHeader>true</showHeader>
    </screens>
    <start>
        <locationX>50</locationX>
        <locationY>0</locationY>
        <connector>
            <targetReference>Leave_Request_Form</targetReference>
        </connector>
    </start>
    <status>Active</status>
</Flow>
`);

// Record-Triggered Flow: FLW_Leave_Request_Validation
fs.writeFileSync(path.join(flowsDir, 'FLW_Leave_Request_Validation.flow-meta.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<Flow xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>61.0</apiVersion>
    <description>Record-Triggered Flow on Leave_Request__c (Before Insert) to set default submission timestamp, validate routing criteria, and assign initial approval tier.</description>
    <environments>Default</environments>
    <interviewLabel>Leave Request Initial Setup Flow {!$Flow.CurrentDateTime}</interviewLabel>
    <label>FLW_Leave_Request_Validation</label>
    <processMetadataValues>
        <name>BuilderType</name>
        <value><stringValue>LightningFlowBuilder</stringValue></value>
    </processMetadataValues>
    <processType>AutoLaunchedFlow</processType>
    <recordUpdates>
        <name>Set_Default_Fields</name>
        <label>Set Default Fields</label>
        <locationX>176</locationX>
        <locationY>287</locationY>
        <inputAssignments>
            <field>Submitted_Date__c</field>
            <value><elementReference>$Flow.CurrentDateTime</elementReference></value>
        </inputAssignments>
        <inputAssignments>
            <field>Approval_Level__c</field>
            <value><stringValue>Manager</stringValue></value>
        </inputAssignments>
        <inputAssignments>
            <field>Status__c</field>
            <value><stringValue>Submitted</stringValue></value>
        </inputAssignments>
        <inputReference>$Record</inputReference>
    </recordUpdates>
    <start>
        <locationX>50</locationX>
        <locationY>0</locationY>
        <connector>
            <targetReference>Set_Default_Fields</targetReference>
        </connector>
        <object>Leave_Request__c</object>
        <recordTriggerType>Create</recordTriggerType>
        <triggerType>RecordBeforeSave</triggerType>
    </start>
    <status>Active</status>
</Flow>
`);

// Record-Triggered Flow: FLW_Leave_Approval_Routing
fs.writeFileSync(path.join(flowsDir, 'FLW_Leave_Approval_Routing.flow-meta.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<Flow xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>61.0</apiVersion>
    <decisions>
        <name>Check_Status_and_Duration_Routing</name>
        <label>Check Status and Duration Routing</label>
        <locationX>578</locationX>
        <locationY>323</locationY>
        <defaultConnectorLabel>Default</defaultConnectorLabel>
        <rules>
            <name>Manager_Approved_Short_Duration</name>
            <conditionLogic>and</conditionLogic>
            <conditions>
                <leftValueReference>$Record.Status__c</leftValueReference>
                <operator>EqualTo</operator>
                <rightValue><stringValue>Manager Approved</stringValue></rightValue>
            </conditions>
            <conditions>
                <leftValueReference>$Record.Leave_Days__c</leftValueReference>
                <operator>LessThanOrEqualTo</operator>
                <rightValue><numberValue>2.0</numberValue></rightValue>
            </conditions>
            <connector>
                <targetReference>Auto_Promote_To_Final_Approved</targetReference>
            </connector>
            <label>1-2 Days: Direct to Final Approval</label>
        </rules>
        <rules>
            <name>Manager_Approved_Medium_Duration</name>
            <conditionLogic>and</conditionLogic>
            <conditions>
                <leftValueReference>$Record.Status__c</leftValueReference>
                <operator>EqualTo</operator>
                <rightValue><stringValue>Manager Approved</stringValue></rightValue>
            </conditions>
            <conditions>
                <leftValueReference>$Record.Leave_Days__c</leftValueReference>
                <operator>GreaterThan</operator>
                <rightValue><numberValue>2.0</numberValue></rightValue>
            </conditions>
            <connector>
                <targetReference>Route_To_HR_Review</targetReference>
            </connector>
            <label>3+ Days: Route to HR</label>
        </rules>
        <rules>
            <name>HR_Approved_Long_Duration</name>
            <conditionLogic>and</conditionLogic>
            <conditions>
                <leftValueReference>$Record.Status__c</leftValueReference>
                <operator>EqualTo</operator>
                <rightValue><stringValue>HR Approved</stringValue></rightValue>
            </conditions>
            <conditions>
                <leftValueReference>$Record.Leave_Days__c</leftValueReference>
                <operator>GreaterThan</operator>
                <rightValue><numberValue>5.0</numberValue></rightValue>
            </conditions>
            <connector>
                <targetReference>Route_To_Final_Approver</targetReference>
            </connector>
            <label>&gt; 5 Days: Route to Final Approver</label>
        </rules>
        <rules>
            <name>HR_Approved_Medium_Duration</name>
            <conditionLogic>and</conditionLogic>
            <conditions>
                <leftValueReference>$Record.Status__c</leftValueReference>
                <operator>EqualTo</operator>
                <rightValue><stringValue>HR Approved</stringValue></rightValue>
            </conditions>
            <conditions>
                <leftValueReference>$Record.Leave_Days__c</leftValueReference>
                <operator>LessThanOrEqualTo</operator>
                <rightValue><numberValue>5.0</numberValue></rightValue>
            </conditions>
            <connector>
                <targetReference>Auto_Promote_To_Final_Approved_From_HR</targetReference>
            </connector>
            <label>3-5 Days: Finalize Approval</label>
        </rules>
        <rules>
            <name>Request_Rejected</name>
            <conditionLogic>and</conditionLogic>
            <conditions>
                <leftValueReference>$Record.Status__c</leftValueReference>
                <operator>EqualTo</operator>
                <rightValue><stringValue>Rejected</stringValue></rightValue>
            </conditions>
            <connector>
                <targetReference>Finalize_Rejection</targetReference>
            </connector>
            <label>Request Rejected</label>
        </rules>
    </decisions>
    <description>Conditional multi-level approval routing flow based on leave duration and approval milestones.</description>
    <environments>Default</environments>
    <interviewLabel>Leave Approval Routing Flow {!$Flow.CurrentDateTime}</interviewLabel>
    <label>FLW_Leave_Approval_Routing</label>
    <processMetadataValues>
        <name>BuilderType</name>
        <value><stringValue>LightningFlowBuilder</stringValue></value>
    </processMetadataValues>
    <processType>AutoLaunchedFlow</processType>
    <recordUpdates>
        <name>Auto_Promote_To_Final_Approved</name>
        <label>Promote To Final Approved (1-2 Days)</label>
        <locationX>50</locationX>
        <locationY>431</locationY>
        <inputAssignments>
            <field>Approval_Level__c</field>
            <value><stringValue>None</stringValue></value>
        </inputAssignments>
        <inputAssignments>
            <field>Approved_Date__c</field>
            <value><elementReference>$Flow.CurrentDateTime</elementReference></value>
        </inputAssignments>
        <inputAssignments>
            <field>Is_Finalized__c</field>
            <value><booleanValue>true</booleanValue></value>
        </inputAssignments>
        <inputAssignments>
            <field>Status__c</field>
            <value><stringValue>Final Approved</stringValue></value>
        </inputAssignments>
        <inputReference>$Record</inputReference>
    </recordUpdates>
    <recordUpdates>
        <name>Route_To_HR_Review</name>
        <label>Route To HR Review</label>
        <locationX>314</locationX>
        <locationY>431</locationY>
        <inputAssignments>
            <field>Approval_Level__c</field>
            <value><stringValue>HR</stringValue></value>
        </inputAssignments>
        <inputReference>$Record</inputReference>
    </recordUpdates>
    <recordUpdates>
        <name>Route_To_Final_Approver</name>
        <label>Route To Final Approver (&gt;5 Days)</label>
        <locationX>578</locationX>
        <locationY>431</locationY>
        <inputAssignments>
            <field>Approval_Level__c</field>
            <value><stringValue>Final Approver</stringValue></value>
        </inputAssignments>
        <inputReference>$Record</inputReference>
    </recordUpdates>
    <recordUpdates>
        <name>Auto_Promote_To_Final_Approved_From_HR</name>
        <label>Promote To Final Approved From HR</label>
        <locationX>842</locationX>
        <locationY>431</locationY>
        <inputAssignments>
            <field>Approval_Level__c</field>
            <value><stringValue>None</stringValue></value>
        </inputAssignments>
        <inputAssignments>
            <field>Approved_Date__c</field>
            <value><elementReference>$Flow.CurrentDateTime</elementReference></value>
        </inputAssignments>
        <inputAssignments>
            <field>Is_Finalized__c</field>
            <value><booleanValue>true</booleanValue></value>
        </inputAssignments>
        <inputAssignments>
            <field>Status__c</field>
            <value><stringValue>Final Approved</stringValue></value>
        </inputAssignments>
        <inputReference>$Record</inputReference>
    </recordUpdates>
    <recordUpdates>
        <name>Finalize_Rejection</name>
        <label>Finalize Rejection</label>
        <locationX>1106</locationX>
        <locationY>431</locationY>
        <inputAssignments>
            <field>Approval_Level__c</field>
            <value><stringValue>None</stringValue></value>
        </inputAssignments>
        <inputAssignments>
            <field>Is_Finalized__c</field>
            <value><booleanValue>true</booleanValue></value>
        </inputAssignments>
        <inputReference>$Record</inputReference>
    </recordUpdates>
    <start>
        <locationX>452</locationX>
        <locationY>0</locationY>
        <connector>
            <targetReference>Check_Status_and_Duration_Routing</targetReference>
        </connector>
        <object>Leave_Request__c</object>
        <recordTriggerType>Update</recordTriggerType>
        <triggerType>RecordAfterSave</triggerType>
    </start>
    <status>Active</status>
</Flow>
`);

// Record-Triggered Flow: FLW_Leave_Balance_Deduction
fs.writeFileSync(path.join(flowsDir, 'FLW_Leave_Balance_Deduction.flow-meta.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<Flow xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>61.0</apiVersion>
    <decisions>
        <name>Check_Leave_Type_Category</name>
        <label>Check Leave Type Category</label>
        <locationX>446</locationX>
        <locationY>323</locationY>
        <defaultConnectorLabel>No Deduction (Unpaid / Other)</defaultConnectorLabel>
        <rules>
            <name>Is_Casual_Leave</name>
            <conditionLogic>and</conditionLogic>
            <conditions>
                <leftValueReference>$Record.Leave_Type__c</leftValueReference>
                <operator>EqualTo</operator>
                <rightValue><stringValue>Casual Leave</stringValue></rightValue>
            </conditions>
            <connector>
                <targetReference>Deduct_Casual_Leave</targetReference>
            </connector>
            <label>Casual Leave</label>
        </rules>
        <rules>
            <name>Is_Sick_Leave</name>
            <conditionLogic>and</conditionLogic>
            <conditions>
                <leftValueReference>$Record.Leave_Type__c</leftValueReference>
                <operator>EqualTo</operator>
                <rightValue><stringValue>Sick Leave</stringValue></rightValue>
            </conditions>
            <connector>
                <targetReference>Deduct_Sick_Leave</targetReference>
            </connector>
            <label>Sick Leave</label>
        </rules>
        <rules>
            <name>Is_Earned_Leave</name>
            <conditionLogic>and</conditionLogic>
            <conditions>
                <leftValueReference>$Record.Leave_Type__c</leftValueReference>
                <operator>EqualTo</operator>
                <rightValue><stringValue>Earned Leave</stringValue></rightValue>
            </conditions>
            <connector>
                <targetReference>Deduct_Earned_Leave</targetReference>
            </connector>
            <label>Earned Leave</label>
        </rules>
    </decisions>
    <description>Automatically deducts leave days from employee balance quota upon final approval.</description>
    <environments>Default</environments>
    <formulas>
        <name>Formula_New_Casual_Used</name>
        <dataType>Number</dataType>
        <expression>{!$Record.Employee__r.Used_Casual_Leave__c} + {!$Record.Leave_Days__c}</expression>
        <scale>0</scale>
    </formulas>
    <formulas>
        <name>Formula_New_Sick_Used</name>
        <dataType>Number</dataType>
        <expression>{!$Record.Employee__r.Used_Sick_Leave__c} + {!$Record.Leave_Days__c}</expression>
        <scale>0</scale>
    </formulas>
    <formulas>
        <name>Formula_New_Earned_Used</name>
        <dataType>Number</dataType>
        <expression>{!$Record.Employee__r.Used_Earned_Leave__c} + {!$Record.Leave_Days__c}</expression>
        <scale>0</scale>
    </formulas>
    <interviewLabel>Leave Balance Deduction Flow {!$Flow.CurrentDateTime}</interviewLabel>
    <label>FLW_Leave_Balance_Deduction</label>
    <processMetadataValues>
        <name>BuilderType</name>
        <value><stringValue>LightningFlowBuilder</stringValue></value>
    </processMetadataValues>
    <processType>AutoLaunchedFlow</processType>
    <recordUpdates>
        <name>Deduct_Casual_Leave</name>
        <label>Deduct Casual Leave</label>
        <locationX>50</locationX>
        <locationY>431</locationY>
        <filterLogic>and</filterLogic>
        <filters>
            <field>Id</field>
            <operator>EqualTo</operator>
            <value><elementReference>$Record.Employee__c</elementReference></value>
        </filters>
        <inputAssignments>
            <field>Used_Casual_Leave__c</field>
            <value><elementReference>Formula_New_Casual_Used</elementReference></value>
        </inputAssignments>
        <object>Employee__c</object>
    </recordUpdates>
    <recordUpdates>
        <name>Deduct_Sick_Leave</name>
        <label>Deduct Sick Leave</label>
        <locationX>314</locationX>
        <locationY>431</locationY>
        <filterLogic>and</filterLogic>
        <filters>
            <field>Id</field>
            <operator>EqualTo</operator>
            <value><elementReference>$Record.Employee__c</elementReference></value>
        </filters>
        <inputAssignments>
            <field>Used_Sick_Leave__c</field>
            <value><elementReference>Formula_New_Sick_Used</elementReference></value>
        </inputAssignments>
        <object>Employee__c</object>
    </recordUpdates>
    <recordUpdates>
        <name>Deduct_Earned_Leave</name>
        <label>Deduct Earned Leave</label>
        <locationX>578</locationX>
        <locationY>431</locationY>
        <filterLogic>and</filterLogic>
        <filters>
            <field>Id</field>
            <operator>EqualTo</operator>
            <value><elementReference>$Record.Employee__c</elementReference></value>
        </filters>
        <inputAssignments>
            <field>Used_Earned_Leave__c</field>
            <value><elementReference>Formula_New_Earned_Used</elementReference></value>
        </inputAssignments>
        <object>Employee__c</object>
    </recordUpdates>
    <start>
        <locationX>320</locationX>
        <locationY>0</locationY>
        <connector>
            <targetReference>Check_Leave_Type_Category</targetReference>
        </connector>
        <doesRequireRecordChangedToMeetCriteria>true</doesRequireRecordChangedToMeetCriteria>
        <filterLogic>and</filterLogic>
        <filters>
            <field>Status__c</field>
            <operator>EqualTo</operator>
            <value><stringValue>Final Approved</stringValue></value>
        </filters>
        <object>Leave_Request__c</object>
        <recordTriggerType>Update</recordTriggerType>
        <triggerType>RecordAfterSave</triggerType>
    </start>
    <status>Active</status>
</Flow>
`);

// 5. PERMISSION SETS
const psDir = path.join(baseDir, 'permissionsets');
ensureDir(psDir);

fs.writeFileSync(path.join(psDir, 'PS_Employee.permissionset-meta.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<PermissionSet xmlns="http://soap.sforce.com/2006/04/metadata">
    <description>Grants standard employees access to view profile, balance quotas, and submit leave requests.</description>
    <hasActivationRequired>false</hasActivationRequired>
    <label>PS_Employee</label>
    <objectPermissions>
        <allowCreate>false</allowCreate>
        <allowDelete>false</allowDelete>
        <allowEdit>false</allowEdit>
        <allowRead>true</allowRead>
        <modifyAllRecords>false</modifyAllRecords>
        <object>Employee__c</object>
        <viewAllRecords>false</viewAllRecords>
    </objectPermissions>
    <objectPermissions>
        <allowCreate>true</allowCreate>
        <allowDelete>false</allowDelete>
        <allowEdit>true</allowEdit>
        <allowRead>true</allowRead>
        <modifyAllRecords>false</modifyAllRecords>
        <object>Leave_Request__c</object>
        <viewAllRecords>false</viewAllRecords>
    </objectPermissions>
</PermissionSet>
`);

fs.writeFileSync(path.join(psDir, 'PS_Manager.permissionset-meta.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<PermissionSet xmlns="http://soap.sforce.com/2006/04/metadata">
    <description>Grants team managers ability to review, approve, and reject team leave requests.</description>
    <hasActivationRequired>false</hasActivationRequired>
    <label>PS_Manager</label>
    <objectPermissions>
        <allowCreate>false</allowCreate>
        <allowDelete>false</allowDelete>
        <allowEdit>false</allowEdit>
        <allowRead>true</allowRead>
        <modifyAllRecords>false</modifyAllRecords>
        <object>Employee__c</object>
        <viewAllRecords>true</viewAllRecords>
    </objectPermissions>
    <objectPermissions>
        <allowCreate>true</allowCreate>
        <allowDelete>false</allowDelete>
        <allowEdit>true</allowEdit>
        <allowRead>true</allowRead>
        <modifyAllRecords>false</modifyAllRecords>
        <object>Leave_Request__c</object>
        <viewAllRecords>true</viewAllRecords>
    </objectPermissions>
</PermissionSet>
`);

fs.writeFileSync(path.join(psDir, 'PS_HR.permissionset-meta.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<PermissionSet xmlns="http://soap.sforce.com/2006/04/metadata">
    <description>Grants HR administrators full management of employees, leave quotas, approval queues, and reports.</description>
    <hasActivationRequired>false</hasActivationRequired>
    <label>PS_HR</label>
    <objectPermissions>
        <allowCreate>true</allowCreate>
        <allowDelete>true</allowDelete>
        <allowEdit>true</allowEdit>
        <allowRead>true</allowRead>
        <modifyAllRecords>true</modifyAllRecords>
        <object>Employee__c</object>
        <viewAllRecords>true</viewAllRecords>
    </objectPermissions>
    <objectPermissions>
        <allowCreate>true</allowCreate>
        <allowDelete>true</allowDelete>
        <allowEdit>true</allowEdit>
        <allowRead>true</allowRead>
        <modifyAllRecords>true</modifyAllRecords>
        <object>Leave_Request__c</object>
        <viewAllRecords>true</viewAllRecords>
    </objectPermissions>
</PermissionSet>
`);

// 6. LIGHTNING APPLICATION
const appDir = path.join(baseDir, 'applications');
ensureDir(appDir);

fs.writeFileSync(path.join(appDir, 'Employee_Leave_HR_Management.app-meta.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<CustomApplication xmlns="http://soap.sforce.com/2006/04/metadata">
    <brand>
        <headerColor>#C96F5B</headerColor>
        <shouldOverrideOrgTheme>false</shouldOverrideOrgTheme>
    </brand>
    <description>Declarative HR leave management system for employee self-service, manager approvals, and HR oversight.</description>
    <formFactors>
        <supportedFormFactor>Large</supportedFormFactor>
        <supportedFormFactor>Small</supportedFormFactor>
    </formFactors>
    <label>Employee Leave &amp; HR Management</label>
    <navFeed>false</navFeed>
    <tabs>
        <tab>standard-home</tab>
        <tab>Employee__c</tab>
        <tab>Leave_Request__c</tab>
        <tab>standard-report</tab>
        <tab>standard-Dashboard</tab>
    </tabs>
    <uiType>Lightning</uiType>
    <utilityBar>Employee_Leave_UtilityBar</utilityBar>
</CustomApplication>
`);

// 7. REPORTS & REPORT TYPES
const reportsDir = path.join(baseDir, 'reports', 'HR_Leave_Reports');
ensureDir(reportsDir);

const reportList = [
  { name: 'RPT_All_Leave_Requests', label: 'All Leave Requests Master Report', desc: 'Complete log of all employee leave applications.' },
  { name: 'RPT_Pending_Approvals', label: 'Pending Leave Approvals Queue', desc: 'Active leave requests awaiting review.' },
  { name: 'RPT_Approved_Leaves', label: 'Approved Leaves YTD', desc: 'All confirmed leaves across all departments.' },
  { name: 'RPT_Rejected_Leaves', label: 'Rejected Leave Applications', desc: 'Summary of rejected requests with reasons.' },
  { name: 'RPT_Department_Leave_Analysis', label: 'Leave Analysis by Department', desc: 'Department-wise leave consumption comparison.' },
  { name: 'RPT_Leave_Type_Analysis', label: 'Leave Breakdown by Type', desc: 'Casual vs Sick vs Earned leave distribution.' },
  { name: 'RPT_Monthly_Leave_Trends', label: 'Monthly Leave Trends', desc: 'Time-series analysis of leave requests submitted per month.' }
];

reportList.forEach(r => {
  fs.writeFileSync(path.join(reportsDir, r.name + '.report-meta.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<Report xmlns="http://soap.sforce.com/2006/04/metadata">
    <columns>
        <field>CUST_NAME</field>
    </columns>
    <columns>
        <field>Leave_Request__c.Employee__c</field>
    </columns>
    <columns>
        <field>Leave_Request__c.Leave_Type__c</field>
    </columns>
    <columns>
        <field>Leave_Request__c.Start_Date__c</field>
    </columns>
    <columns>
        <field>Leave_Request__c.End_Date__c</field>
    </columns>
    <columns>
        <field>Leave_Request__c.Leave_Days__c</field>
    </columns>
    <columns>
        <field>Leave_Request__c.Status__c</field>
    </columns>
    <description>${r.desc}</description>
    <format>Summary</format>
    <name>${r.label}</name>
    <params>
        <name>co</name>
        <value>1</value>
    </params>
    <reportType>CustomEntity$Leave_Request__c</reportType>
    <scope>organization</scope>
    <showDetails>true</showDetails>
    <showSubTotals>true</showSubTotals>
    <timeFrameFilter>
        <dateColumn>Leave_Request__c.Start_Date__c</dateColumn>
        <interval>INTERVAL_CUSTOM</interval>
    </timeFrameFilter>
</Report>
`);
});

// 8. DASHBOARD
const dashDir = path.join(baseDir, 'dashboards', 'HR_Dashboards');
ensureDir(dashDir);

fs.writeFileSync(path.join(dashDir, 'DB_HR_Leave_Management.dashboard-meta.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<Dashboard xmlns="http://soap.sforce.com/2006/04/metadata">
    <backgroundEndColor>#F8F5F0</backgroundEndColor>
    <backgroundFadeDirection>Diagonal</backgroundFadeDirection>
    <backgroundStartColor>#FFFFFF</backgroundStartColor>
    <chartTheme>light</chartTheme>
    <colorPalette>warm</colorPalette>
    <dashboardGridLayout>
        <dashboardGridComponents>
            <colSpan>3</colSpan>
            <columnIndex>0</columnIndex>
            <dashboardComponent>
                <autoselectColumnsFromReport>true</autoselectColumnsFromReport>
                <chartAxisRange>Auto</chartAxisRange>
                <componentType>Metric</componentType>
                <displayUnits>Auto</displayUnits>
                <header>Pending Requests</header>
                <indicatorBreakpoint1>5.0</indicatorBreakpoint1>
                <indicatorBreakpoint2>10.0</indicatorBreakpoint2>
                <indicatorHighColor>#B85C5C</indicatorHighColor>
                <indicatorLowColor>#718C72</indicatorLowColor>
                <indicatorMiddleColor>#C49A52</indicatorMiddleColor>
                <report>HR_Leave_Reports/RPT_Pending_Approvals</report>
                <showRange>false</showRange>
            </dashboardComponent>
            <rowIndex>0</rowIndex>
            <rowSpan>4</rowSpan>
        </dashboardGridComponents>
        <dashboardGridComponents>
            <colSpan>3</colSpan>
            <columnIndex>3</columnIndex>
            <dashboardComponent>
                <autoselectColumnsFromReport>true</autoselectColumnsFromReport>
                <chartAxisRange>Auto</chartAxisRange>
                <componentType>Metric</componentType>
                <displayUnits>Auto</displayUnits>
                <header>Approved Leaves YTD</header>
                <report>HR_Leave_Reports/RPT_Approved_Leaves</report>
                <showRange>false</showRange>
            </dashboardComponent>
            <rowIndex>0</rowIndex>
            <rowSpan>4</rowSpan>
        </dashboardGridComponents>
        <dashboardGridComponents>
            <colSpan>6</colSpan>
            <columnIndex>6</columnIndex>
            <dashboardComponent>
                <autoselectColumnsFromReport>true</autoselectColumnsFromReport>
                <chartAxisRange>Auto</chartAxisRange>
                <componentType>Donut</componentType>
                <displayUnits>Auto</displayUnits>
                <header>Leave by Type</header>
                <report>HR_Leave_Reports/RPT_Leave_Type_Analysis</report>
                <showPercentage>true</showPercentage>
                <showValues>true</showValues>
            </dashboardComponent>
            <rowIndex>0</rowIndex>
            <rowSpan>4</rowSpan>
        </dashboardGridComponents>
        <dashboardGridComponents>
            <colSpan>6</colSpan>
            <columnIndex>0</columnIndex>
            <dashboardComponent>
                <autoselectColumnsFromReport>true</autoselectColumnsFromReport>
                <chartAxisRange>Auto</chartAxisRange>
                <componentType>Bar</componentType>
                <displayUnits>Auto</displayUnits>
                <header>Leave by Department</header>
                <report>HR_Leave_Reports/RPT_Department_Leave_Analysis</report>
                <showValues>true</showValues>
            </dashboardComponent>
            <rowIndex>4</rowIndex>
            <rowSpan>6</rowSpan>
        </dashboardGridComponents>
        <dashboardGridComponents>
            <colSpan>6</colSpan>
            <columnIndex>6</columnIndex>
            <dashboardComponent>
                <autoselectColumnsFromReport>true</autoselectColumnsFromReport>
                <chartAxisRange>Auto</chartAxisRange>
                <componentType>Line</componentType>
                <displayUnits>Auto</displayUnits>
                <header>Monthly Leave Trend</header>
                <report>HR_Leave_Reports/RPT_Monthly_Leave_Trends</report>
                <showValues>true</showValues>
            </dashboardComponent>
            <rowIndex>4</rowIndex>
            <rowSpan>6</rowSpan>
        </dashboardGridComponents>
    </dashboardGridLayout>
    <description>Executive overview of company leave trends, approval velocity, and departmental distributions.</description>
    <isGridLayout>true</isGridLayout>
    <label>DB_HR_Leave_Management</label>
    <textColor>#252525</textColor>
    <title>HR Leave &amp; Workforce Analytics</title>
    <titleColor>#252525</titleColor>
    <titleFontSize>14</titleFontSize>
</Dashboard>
`);

console.log('Successfully generated all Salesforce DX metadata!');
