import nodemailer from 'nodemailer';

async function enviarCorreoP(correo, codigo) {
  try {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    const info = await transporter.sendMail({
      from: '"Pruebas AgroApp" <no-reply@agroapp.com>',
      to: correo,
      subject: 'Código de recuperación',
      text: `Tu código de verificación es: ${codigo}`,
    });

    console.log('Correo enviado. Vista previa:', nodemailer.getTestMessageUrl(info));
    return nodemailer.getTestMessageUrl(info);
  } catch (error) {
    console.error('Error al enviar correo de prueba:', error.message);
    throw new Error('No se pudo enviar el correo de recuperación');
  }
}

export default enviarCorreoP;
