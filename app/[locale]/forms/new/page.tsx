
import { queryCustomers } from "../../../../components/chain_utils";
import NewPanel from "./panel";

export default async function Page() {
    const userList = await queryCustomers();
    return (
        <NewPanel users={userList} />
    )

}
