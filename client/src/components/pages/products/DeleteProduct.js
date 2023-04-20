
import { Link } from 'react-router-dom'

const DeleteProduct = () => {
  return (
    <div className='flex-delete'>
      <h1 className="delete-msg">Ad succesfully deleted!</h1>
      <Link className="btn-delete" as={Link} to='/profile'>Account</Link>
    </div>
  )
}

export default DeleteProduct