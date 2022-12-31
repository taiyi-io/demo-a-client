import Link from 'next/link';

const pseudoData = {
  offset: 1,
  size: 20,
  total: 130,
  records: [
    {
      id: '1234',
      customer: "wang_xiaoer",
      amount: 500000,
      bank: 'bank_b',
      invoker: 'atom',
      result: true,
      verify_mode: 'manual',
      verifier: 'bob',
      status: 2,
      invoke_time: '2022-12-21 17:41:00',
      verify_time: '2022-12-21 18:55:07'
    },
    {
      id: '2234',
      customer: "zhangsan",
      amount: 45000,
      bank: 'bank_b',
      invoker: 'atom',
      result: true,
      verify_mode: 'contract',
      verifier: 'bob',
      status: 2,
      invoke_time: '2022-12-21 17:41:00',
      verify_time: '2022-12-21 18:55:07'
    },
    {
      id: '2235',
      customer: "lisi",
      amount: 1500000,
      bank: 'bank_b',
      invoker: 'atom',
      result: false,
      verify_mode: 'contract',
      verifier: 'bob',
      status: 2,
      invoke_time: '2022-12-21 17:41:00',
      verify_time: '2022-12-21 18:55:07'
    },
    {
      id: '2236',
      customer: "laoliu",
      amount: 320000,
      bank: 'bank_b',
      invoker: 'atom',
      result: true,
      verify_mode: 'manual',
      verifier: 'bob',
      status: 2,
      invoke_time: '2022-12-21 17:41:00',
      verify_time: '2022-12-21 18:55:07'
    }
  ]
}

export async function getServerSideProps(context) {
  //todo: parse pagination parameters from query
  return {
    props: {
      forms: pseudoData,
    }, // will be passed to the page component as props
  }
}

export default function Forms({forms}) {
  const { offset, size, total } = forms;
  const recordPerPage = size;
  var currentPage = 0;
  if (offset >= recordPerPage){
    currentPage = Math.floor(offset / recordPerPage);
  }
  let totalPages = 0;
  if (0 === total % recordPerPage) {
    totalPages = total / recordPerPage;
  } else {
    totalPages = Math.ceil(total / recordPerPage);
  }
  return (
    <div>
      <h5>This is the list of requesting forms</h5>
      <h5>{currentPage + ' / ' + totalPages + ' pages'}</h5>
      <table>
        <tr>
          <th>ID</th>
          <th>Customer</th>
          <th>Amount</th>
          <th>Bank</th>
          <th>Verify Mode</th>
          <th>Verify Result</th>
          <th>Status</th>
          <th>Invoke Time</th>
          <th>Verify Time</th>
          <th></th>
        </tr>
        {
          forms.records.map(({id, customer, amount, bank, verify_mode, result,
           status, invoke_time, verify_time}) => {

             return (
              <tr>
                <td>{id}</td>
                <td>{customer}</td>
                <td>{amount}</td>
                <td>{bank}</td>
                <td>{verify_mode}</td>
                <td>{result? 'Approved': 'Reject'}</td>
                <td>{status}</td>
                <td>{invoke_time}</td>
                <td>{verify_time}</td>
                <td>
                  <Link href={'/forms/view/' + id}>View</Link>&nbsp;
                  <Link href={'/forms/view/' + id}>Submit</Link>
                </td>
              </tr>
            );
           })
        }
      </table>
    </div>
  )
}
