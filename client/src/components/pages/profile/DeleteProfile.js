
import { Link } from 'react-router-dom'

const DeleteProfile = () => {
  return (
    <div className='flex-delete'>
      <h1 className="delete-msg">Your account was succesfully deleted! Hoping to see you back soon.</h1>
      <Link className="btn-delete" as={Link} to='/register'>Register</Link>
    </div>
  )
}

export default DeleteProfile