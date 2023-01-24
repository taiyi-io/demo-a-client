import { ResponsePayload } from "../pages/api/response";

export async function keepAlive() {
  const url = '/api/alive/';
  const options = {
    method: 'PUT',
  };
  await fetch(url, options);
}

export async function submitRequest(requestID: string, invokerID: string, bank: string, mode: string,) {
  const payload = {
    invoker: invokerID,
    bank: bank,
    mode: mode,
  };
  const url = '/api/requests/' + requestID;
  const options: RequestInit = {
    method: 'PUT',
    body: JSON.stringify(payload),
  };
  let resp = await fetch(url, options);
  if (!resp.ok) {
    throw new Error(resp.statusText);
  }
  let result: ResponsePayload = await resp.json();
  if (0 !== result.error_code) {
    throw new Error(result.message);
  }
}

export async function createRequest(invokerID: string, customer: string, amount: number, asset: number): Promise<string> {
  const payload = {
    creator: invokerID,
    customer: customer,
    amount: amount,
    asset: asset
  };
  const url = '/api/requests/';
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(payload),
  };
  let resp = await fetch(url, options);
  if (!resp.ok) {
    throw new Error(resp.statusText);
  }
  let result: ResponsePayload = await resp.json();
  if (0 !== result.error_code) {
    throw new Error(result.message);
  }
  let requestID: string = result.data.id;
  return requestID;
}
