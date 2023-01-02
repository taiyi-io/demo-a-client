import Link from 'next/link';
import Pagenation from '../../components/pagination';

export default function Forms(props){
    const { offset, size, total, records } = props;
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
        <div class='container-sm'>
          <h5>This is the list of requesting forms</h5>
          <h5>{currentPage + ' / ' + totalPages + ' pages'}</h5>
          <table class="table table-hover">
            <thead>
              <tr class="table-primary">
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
            </thead>
            <tbody>
            {
              records.map(({id, customer, amount, bank, verify_mode, result,
               status, invoke_time, verify_time}) => {
    
                 return (
                  <tr key={id}>
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
                      <Link href={'/forms/view/' + id}>
                        <button type="button" class="btn btn-outline-primary btn-sm">
                          <i class="bi bi-search"></i>
                          View
                        </button>
                      </Link>
                      <Link href={'/forms/view/' + id}>
                        <button type="button" class="btn btn-outline-primary btn-sm">Submit</button>
                      </Link>
                    </td>
                  </tr>
                );
               })
            }
            </tbody>
          </table>
          <Pagenation baseURL='/forms/' current={currentPage} total={totalPages}/>
        </div>
      )
}

