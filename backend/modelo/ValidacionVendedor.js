// src/modelo/ValidacionVendedor.js

class ValidacionVendedor {

  //  Validar campos vacíos
  static verCampos(tipoDoc, documento, edad, nombre_completo, telefono, direccion, email,  contrasena, horario) {
    if (!tipoDoc || !documento || !edad || !nombre_completo || !telefono || !direccion || !email  || !contrasena || !horario) {
      return 'Todos los campos son obligatorios.';
    }
    return null;
  }

  //  Validar tipo de documento
  static verTipoDoc(tipoDoc) {
    const tiposValidos = ['CC', 'TI', 'CE', 'RC'];
    if (!tiposValidos.includes(tipoDoc)) return 'El tipo de documento no es válido';
    return null;
  }

  //  Validar documento (solo números)
  static verDoc(documento) {
    if (!/^\d{8,10}$/.test(documento)) return 'El documento debe tener entre 8 y 10 dígitos numéricos';
    return null;
  }

  //  Validar edad (número positivo)
  static verEdad(edad) {
    if (!/^\d{1,3}$/.test(edad)) return 'Edad inválida';
    return null;
  }

  //  Validar nombre completo
  static verNom(nombre_completo) {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,250}$/;
    if (!regex.test(nombre_completo)) return 'Nombre completo inválido (mínimo 3, máximo 250 caracteres, solo letras y espacios)';
    return null;
  }

  //  Validar teléfono
  static verTel(telefono) {
    if (!/^\d{7,10}$/.test(telefono)) return 'El teléfono debe tener entre 7 y 10 dígitos numéricos';
    return null;
  }

  //  Validar dirección
  static verDir(direccion) {
    if (direccion.length < 5) return 'La dirección es demasiado corta';
    return null;
  }

  //  Validar correo
  static verCor(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) return 'Correo inválido. Ejemplo válido: ejemplo@gmail.com';
    return null;
  }

  //  Validar contraseña
  static verContr(contrasena) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!regex.test(contrasena)) return 'La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un símbolo especial';
    return null;
  }

  //  Validar horario
  static verHor(horario) {
    if (horario.length < 5) return 'La dirección es demasiado corta';
    return null;
  }
}

export default ValidacionVendedor;
