# COOPHARMA API

## Variables de entorno  
  
|   Nombre      |   Tipo de dato    |       Ejemplo     |
|---------------|-------------------|-------------------|
|   `PORT`      |   `Int`           |   `3000`          |
|   `SECRET`    |   `String`        |   `*9ad-asid(*^`  |
|   `dbHost`    |   `String`        |   `localhost`     |
|   `dbUser`    |   `String`        |   `myself`        |
|   `dbPass`    |   `String`        |   `Strong-pass_1` |
|   `dbName`    |   `String`        |   `the_best_db`   |
|   `dbPort`    |   `Int`           |   `3306`   |
|   `emailAuthUser` |   `String`    |   `noti@pixnabilab.com`   |  
|   `emailAuthPass` |   `String`    |   `this-is-p*ssword`  |
|   `S3AccessKeyId` |   `String`    |   `#5(kjbjsdf(*^adf`  |   
|   `S3SecretAccessKey` |   `String`    |   `*$^kjhKJViuLSYBDf7864KJ`   |
|   `stripeKey` |   `String`        |   `saldkjfh89762938*&^(*%`    |
commmercekey: c2ca677075cac084882c265114f8c422bee6e9b4b7ecb55cbcc5cd9e477d2fcf2adc375709322d38d274fcc97e49604f1c59075548a15731d9bdf82f6b1569b7
<!-- 
Para actualizar automaticamente el billing status se utilizo EVENTs de mysql. El query que se muestra a continuacion es el que se ejecuta en el ambiente DEV y de Producion. Si se migra la BD se debe ejecutar este Query -->

<!-- CREATE EVENT IF NOT EXISTS Update_Billing_Status_Recurrence_Event
ON SCHEDULE EVERY 10 second
STARTS CURRENT_TIMESTAMP
DO
update Billings set Billings.billing_status_id=2 where Billings.stimated_paid_date <= CURRENT_TIMESTAMP; -->
