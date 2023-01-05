
import NewPanel from "./new_panel";

const pseudoData = [
    'wang_xiaoer',
    'zhangsan',
    'lisi',
    'laoliu',
];

async function queryUsers() {
    return pseudoData;
}


export default async function Page(props) {
    const userList = await queryUsers();
    return (
        <NewPanel users={userList} />
    )

}
