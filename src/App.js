import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './componentes/css/Menu.css'
import Logo from './componentes/images/imagen1.png';

import AuthDataService from './services/gestor_autenticacion/auth.service';

import Inicio from './componentes/index/inicio.component';
import Inscripcion from './componentes/index/inscripcion.component';
import Contacto from './componentes/index/contacto.component';

import Clientes from './componentes/gestor_usuarios/clientes.component';
import Empleados from './componentes/gestor_usuarios/empleados.component';
import Productos from './componentes/gestor_productos/productos.component';
import Ventas from './componentes/gestor_ventas/ventas.component';

import Bienvenido from './componentes/welcome/bienvenido.component';
import Piepagina from './componentes/footer/piepagina.component';
import EventBus from "./common/event.bus.common";
import NotFound from "./componentes/error/not.found.component";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showSellerBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }


  componentDidMount() {
    debugger;
    const user = AuthDataService.getCurrentUser();

    if (user) {

      this.setState({
        currentUser: user,
        showSellerBoard: this.validateRoleSeller(user.role),
        showAdminBoard: this.validateRoleAdmin(user.role),
        message: "",
        successful: true
      });
    }else{
      this.logOut();
    }

    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  validateRoleSeller(role) { debugger;
    return (role && role.value !== "03" && role.value === "02")? true : false
  }

  validateRoleAdmin(role) {
    return (role && role.value !== "03" && role.value === "01")? true : false
  }

  logOut() {
    AuthDataService.logout();
    this.setState({
      showSellerBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  render(){
    const { currentUser, showSellerBoard, showAdminBoard } = this.state;
    return(<Router>
      <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <img src={Logo} className="menu-img" alt="logo"/>
        <Link to={"#"} className="navbar-brand">
          Gestión de ventas
        </Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse menu-submenu" id="navbarCollapse">
          <ul className="navbar-nav mr-auto nav">
            {currentUser  && (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/welcome"} className="nav-link">
                    {`¡Hola ${currentUser.fullname}!`}
                  </Link>
                </li>
              </div>
            )}
            {showSellerBoard && (
              <div className="navbar-nav ml-auto">
                <li className="nav-item active">
                  <Link className="nav-link" to={"/manage_sales"} >Gestionar ventas</Link>
                </li>
              </div>
            )}
            {showAdminBoard && (
              <div className="navbar-nav ml-auto">
                <li className="nav-item active">
                  <Link className="nav-link" to={"/manage_products"} >Gestionar productos</Link>
                </li>
                <li className="nav-item active">
                  <Link className="nav-link" to={"#"} >Gestionar usuarios</Link>
                <ul>
                  <li>
                    <Link className="nav-link" to={"/consult_clients"} >Consultar clientes</Link>
                  </li>
                  <li>
                    <Link className="nav-link" to={"/consult_employees"} >Consultar empleados</Link>
                  </li>
                </ul>
                </li>
            </div>)}

            {currentUser ? (
              <div className="navbar-nav ml-auto">
              <li className="nav-item">
                  <Link to={"/contact"} className="nav-link">
                    Contacto
                  </Link>
                </li>
                <li className="nav-item">
                  <a href="/login" className="nav-link" onClick={this.logOut}>
                    Cerrar sesión
                  </a>
                </li>
              </div>
            ) : (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/login"} className="nav-link">
                  Iniciar sesión
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to={"/register"} className="nav-link">
                  Inscribirse
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to={"/contact"} className="nav-link">
                    Contacto
                  </Link>
                </li>
              </div>
            )}
          </ul>
        </div>
      </nav>
      <main className="main">
      <div className="container mt-3">
        <Switch>
          <Route path="/register" component={Inscripcion} />
          <Route path="/contact" component={Contacto} />
          <Route path="/manage_sales" component={Ventas} />
          <Route path="/manage_products" component={Productos} />
          <Route path="/consult_clients" component={Clientes} />
          <Route path="/consult_employees" component={Empleados} />
          <Route path={["/login"]} component={Inicio} />
          <Route path={["/","/welcome"]} component={Bienvenido} />
          <Route path="*" component={NotFound} />
        </Switch>
      </div>
      </main>
      { /*<AuthVerify logOut={this.logOut}/> */ }
    </div>
    <Piepagina/>
    </Router>);
  }
}

export default App;
