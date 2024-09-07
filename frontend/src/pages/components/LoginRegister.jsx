import { Link } from "react-router-dom";

function LoginRegister({openLoginContainer, openRegisterContainer }) {

    return(
      <>
        <ul className="navbar-list">
        <Link onClick={openLoginContainer} to="#">
          <li className="group flex flex-row mr-3 text-base mt-1 p-1 font-normal text-navbar-link hover:text-primary-color">
            <div className="flex flex-row items-center w-full">
              <div className="align-middle mr-2 w-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-navbar-link fill-none line group-hover:stroke-primary-color transition-colors duration-200">
                  <path d="M14 22h5a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-5"></path>
                  <polyline points="11 16 15 12 11 8"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
              </div>
              <div className="flex-1">
                Log in
              </div>
            </div>
          </li>
        </Link>

        <Link to="#" onClick={openRegisterContainer}>
          <li className="group flex flex-row mr-3 text-base mt-1 p-1 font-normal text-navbar-link hover:text-primary-color">
            <div className="flex flex-row items-center w-full">
              <div className="align-middle mr-2 w-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-navbar-link fill-none line group-hover:stroke-primary-color transition-colors duration-200">
                  <path d="M14 22h5a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-5"></path>
                  <polyline points="11 16 15 12 11 8"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
              </div>
              <div className="flex-1">
                Register
              </div>
            </div>
          </li>
        </Link>
      </ul>
      </>
    );
}

export default LoginRegister;