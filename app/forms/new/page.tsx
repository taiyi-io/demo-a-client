
import NewPanel from "./panel";

const pseudoData = [
    'wang_xiaoer',
    'zhangsan',
    'lisi',
    'laoliu',
];

async function queryUsers() {
    return pseudoData;
}


export default async function Page() {
    const userList = await queryUsers();
    return (
        <NewPanel users={userList} />
    )

}
