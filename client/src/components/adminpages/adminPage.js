import { Redirect, useHistory } from "react-router-dom"






const AdminPage = () => {

    const history = useHistory()
    history.push("/adminpage/users")

    return(
        <div>

        </div>
    )
}

export default AdminPage