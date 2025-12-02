class ValidacionUsuario {

  static verCampos(...campos) {
  for (let campo of campos) {

    // Convertir a string para evitar errores con números
    const valor = String(campo).trim();

    if (!valor) {
      return 'Hay campos vacíos';
    }
  }
  return null;
}

  static verTipoDoc(tipo) {
    if (!['CC','TI','CE','PA'].includes(tipo)) return 'Tipo de documento inválido';
    return null;
  }

  static verDoc(doc) {
    if (!/^[0-9]{5,15}$/.test(doc)) return 'Documento inválido';
    return null;
  }

  static verEdad(edad) {
    if (isNaN(edad) || edad < 1 || edad > 120) return 'Edad inválida';
    return null;
  }

 static verNom(nombre_completo) {
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
  if (!regex.test(nombre_completo.trim())) return 'Nombre inválido';
  return null;
}


  static verTel(tel) {
    if (!/^[0-9]{7,10}$/.test(tel)) return 'Teléfono inválido';
    return null;
  }

  static verDir(dir) {
    if (dir.length < 5) return 'Dirección inválida';
    return null;
  }

  static verCor(email) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Correo inválido';
    return null;
  }

  static verContr(contrasena) {
    if (contrasena.length < 6) return 'Contraseña muy corta';
    return null;
  }
}

export default ValidacionUsuario;
