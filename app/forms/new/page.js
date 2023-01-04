
import CreateForm from './request';

const pseudoData = [
    'wang_xiaoer',
    'zhangsan',
    'lisi',
    'laoliu',
];

async function queryUsers(){
    return pseudoData;
}


export default async function Page(props){
    const userList = await queryUsers();
    return (
        <div className='container'>
            <div className='row p-3'>
                <div className='col-3'>          
                </div>
                <div className='col-6'>
                    <CreateForm users={userList}/>
                </div>
            </div>
        </div>
    )

}
