import axios from 'axios'

const SF_INSTANCE = import.meta.env.VITE_SF_INSTANCE_URL || ''
const API_VERSION = import.meta.env.VITE_SF_API_VERSION || '58.0'

if (!SF_INSTANCE) {
  console.warn('[salesforce] VITE_SF_INSTANCE_URL is not set. API calls will fail until you configure .env']
}

let accessToken: string | null = null

export function setAccessToken(token: string) {
  accessToken = token
}

function getClient() {
  if (!SF_INSTANCE) throw new Error('Salesforce instance URL not configured (VITE_SF_INSTANCE_URL)')
  const client = axios.create({
    baseURL: `${SF_INSTANCE}/services/data/v${API_VERSION}/`,
    headers: {
      'Content-Type': 'application/json',
    },
  })
  client.interceptors.request.use(cfg => {
    if (accessToken) cfg.headers = { ...cfg.headers, Authorization: `Bearer ${accessToken}` }
    return cfg
  })
  return client
}

// Example: query employees. Update object/API names to match your org.
export async function getEmployees() {
  // SOQL example: adjust fields/object names
  const soql = `SELECT Id, Name, Email__c, Role__c FROM Employee__c LIMIT 200`
  try {
    const client = getClient()
    const resp = await client.get(`query?q=${encodeURIComponent(soql)}`)
    return resp.data.records
  } catch (err) {
    console.error('[salesforce] getEmployees error', err)
    throw err
  }
}

export async function getLeaveRequests() {
  const soql = `SELECT Id, Name, Employee__c, Status__c, Start_Date__c, End_Date__c, Type__c, Reason__c FROM Leave_Request__c ORDER BY CreatedDate DESC LIMIT 200`
  try {
    const client = getClient()
    const resp = await client.get(`query?q=${encodeURIComponent(soql)}`)
    return resp.data.records
  } catch (err) {
    console.error('[salesforce] getLeaveRequests error', err)
    throw err
  }
}

export async function createLeaveRequest(payload:{Employee__c:string, Type__c:string, Start_Date__c:string, End_Date__c:string, Reason__c:string}){
  try{
    const client = getClient()
    const resp = await client.post(`sobjects/Leave_Request__c`, payload)
    return resp.data
  }catch(err){
    console.error('[salesforce] createLeaveRequest error', err)
    throw err
  }
}

export async function updateLeaveRequestStatus(id:string, status:string){
  try{
    const client = getClient()
    // PATCH to sobject/{id}
    const resp = await client.patch(`sobjects/Leave_Request__c/${id}`, { Status__c: status })
    return resp.status === 204
  }catch(err){
    console.error('[salesforce] updateLeaveRequestStatus error', err)
    throw err
  }
}

// Helper to start OAuth flow (browser-based). You still need to register a Connected App in Salesforce.
export function salesforceAuthUrl(){
  const clientId = import.meta.env.VITE_SF_CLIENT_ID
  const redirect = import.meta.env.VITE_SF_REDIRECT_URI
  if(!clientId || !redirect) throw new Error('VITE_SF_CLIENT_ID and VITE_SF_REDIRECT_URI must be configured')
  const base = SF_INSTANCE || 'https://login.salesforce.com'
  const params = new URLSearchParams({
    response_type: 'token',
    client_id: clientId,
    redirect_uri: redirect,
  })
  return `${base}/services/oauth2/authorize?${params.toString()}`
}
