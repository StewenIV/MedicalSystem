using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MailKit.Net.Smtp;

namespace MedicalSystem.API.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendResetCodeEmailAsync(string recipientEmail, string recipientName, string code)
        {
            try
            {
                var smtpSection = _config.GetSection("Smtp");
                var server = smtpSection["Server"];
                var port = int.TryParse(smtpSection["Port"], out var p) ? p : 587;
                var senderName = smtpSection["SenderName"];
                var senderEmail = smtpSection["SenderEmail"];
                var username = smtpSection["Username"];
                var password = smtpSection["Password"]?.Replace(" ", "");

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(senderName, senderEmail));
                message.To.Add(new MailboxAddress(recipientName, recipientEmail));
                message.Subject = "Сброс пароля — Пульмонология";

                message.Body = new TextPart("html")
                {
                    Text = $@"
<html>
  <body style='font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; margin: 0;'>
    <table cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 1px solid #eef2f3;'>
      <!-- Header -->
      <tr>
        <td style='background-color: #f8fafc; padding: 24px; border-bottom: 1px solid #f1f5f9;'>
          <table cellpadding='0' cellspacing='0' width='100%'>
            <tr>
              <td width='50'>
                <img src='https://i.imgur.com/SDUlgVp.jpeg' alt='Иконка' style='max-width: 44px; height: auto; border-radius: 10px; display: block;' />
              </td>
              <td>
                <h2 style='color: #4f46e5; margin: 0; font-size: 20px; font-weight: 700; font-family: sans-serif; margin-left: 10px;'>Пульмонология</h2>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      
      <!-- Body -->
      <tr>
        <td style='padding: 32px 24px;'>
          <h1 style='color: #1e293b; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 12px;'>Восстановление доступа</h1>
          <p style='font-size: 15px; color: #64748b; line-height: 1.5; margin-bottom: 24px;'>Здравствуйте, {recipientName}!<br/>Мы получили запрос на сброс пароля для вашей учетной записи. Используйте код подтверждения ниже, чтобы продолжить:</p>
          
          <div style='background-color: #f1f5f9; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px;'>
            <span style='font-family: monospace; font-size: 32px; font-weight: 700; color: #4f46e5; letter-spacing: 6px;'>{code}</span>
          </div>
          
          <p style='font-size: 13px; color: #94a3b8; line-height: 1.4; margin-bottom: 0;'>Этот код действителен в течение 15 минут. Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.</p>
        </td>
      </tr>
      
      <!-- Footer -->
      <tr>
        <td style='background-color: #f8fafc; padding: 16px 24px; text-align: center; border-top: 1px solid #f1f5f9;'>
          <p style='font-size: 12px; color: #94a3b8; margin: 0;'>🔒 Пожалуйста, не сообщайте этот код третьим лицам.</p>
        </td>
      </tr>
    </table>
  </body>
</html>"
                };

                using (var client = new SmtpClient())
                {
                    await client.ConnectAsync(server, port, MailKit.Security.SecureSocketOptions.StartTls);
                    if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
                    {
                        await client.AuthenticateAsync(username, password);
                    }
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Не удалось отправить email с кодом восстановления.", ex);
            }
        }
    }
}
