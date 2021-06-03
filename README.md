# Parking Backend

## Paquetes instalados:

>Al inicial el proyecto por primera vez usar `npm i` o `npm install`

```
npm i dotenv -D
npm i express firebase cors express-validator moment
```

## EndPoints

>Todas las rutas al iniciar llevan `/api/`

Ejemplo de ruta: `http://localhost:3000/api/getType`

### Tipo vehiculo y limites (vehicleType)

>Ruta `vehicleType/`

- <details>
  <summary>getType (GET)</summary>

  ```sh
  Response ok:
  {
      ok: true,
      message: 'success',
      data: [
          {
              id: String,
              type_name: String,
              maximum_capacity: Number,
              current_capacity: Number
          },
          {
              id: String,
              type_name: String,
              maximum_capacity: Number,
              current_capacity: Number
          }
      ]
  }

  Response fail:
    {
        ok: false,
        message: 'fail'
    }
  ```
  
</details>

- <details>
  <summary>createType (POST)</summary>

  ```sh
  Body:
    {
        type_name: String,
        maximum_capacity: Number,
        current_capacity: Number
    }

  Response ok:
    {
        ok: true,
        message: 'success',
        data: {
            id: String,
            type_name: String,
            maximum_capacity: Number,
            current_capacity: Number
        }
    }

  Response fail:
    {
        ok: false,
        message: 'fail'
    }

  Response existe:
    {
      ok: true,
      message: "Ya esta registrado 'type_name'"
    }
  ```

</details>

- <details>
  <summary>updateType/:ID (PUT)</summary>

  ```sh
  Body:
    {
        maximum_capacity: Number
    }

  Response ok:
    {
        ok: true,
        message: 'success update'
    }

  Response fail:
    {
        ok: false,
        message: 'fail'
    }
  ```
  
</details>

- <details>
  <summary>deleteType/:ID (DELETE)</summary>

  ```sh
  Response ok:
    {
        ok: true,
        message: 'success delete'
    }

  Response fail:
    {
        ok: false,
        message: 'fail'
    }
  ```
  
</details>

### Vehiculos en parqueadero (vehicleParking)

>Ruta `vehicleParking/`

- <details>
  <summary>getvehicleParking (POST)</summary>

  ```sh
  Body:
    {
        limit: Number,
        fistPlates: String, (optional)
        lastPlates: String, (optional)
        type: String (optional)
    }

  Response ok:
    {
        ok: true,
        message: 'success',
        data: [
          {
            id: String,
            plates_vehicle: String,
            doc_owner: String,
            name_owner: String,
            type_vehicle: String,
            id_type_vehicle: String,
            initial_date: String
          },
          {
            id: String,
            plates_vehicle: String,
            doc_owner: String,
            name_owner: String,
            type_vehicle: String,
            id_type_vehicle: String,
            initial_date: String
          }
        ]
    }

  Response fail:
    {
        ok: false,
        message: 'fail'
    }
  ```

</details>

- <details>
  <summary>createvehicleParking (POST)</summary>

  ```sh
  Body:
    {
        plates_vehicle: String,
        doc_owner: String,
        name_owner: String,
        type_vehicle: String,
        id_type_vehicle: String
    }

  Response ok:
    {
        ok: true,
        message: 'success',
        data: {
            id: String,
            plates_vehicle: String,
            doc_owner: String,
            name_owner: String,
            type_vehicle: String,
            id_type_vehicle: String,
            initial_date: String
        }
    }

  Response fail:
    {
        ok: false,
        message: 'fail'
    }

  Response existe:
    {
      ok: true,
      message: "Ya esta registrado 'plates_vehicle'"
    }

  Response no existe tipo:
    {
      ok: true,
      message: "No existe el tipo de vehiculo ingresado"
    }

  Response no existe cupo:
    {
      ok: true,
      message: "Ya se alcanso la capacidad maxima de ese tipo de vehiculo (numero)"
    }
  ```

</details>

</details>

- <details>
  <summary>updatevehicleParking/:ID (PUT)</summary>

  ```sh
  Body:
    {
        plates_vehicle: String,
        doc_owner: String,
        name_owner: String
    }

  Response ok:
    {
        ok: true,
        message: 'success update'
    }

  Response fail:
    {
        ok: false,
        message: 'fail'
    }
  ```

</details>

</details>

- <details>
  <summary>exitvehicleParking/:ID (PUT)</summary>

  ```sh
  Body:
    {
        plates_vehicle: String,
        pay: Number,
        id_type_vehicle: String
    }

  Response ok:
    {
        ok: true,
        message: 'success exit'
    }

  Response fail:
    {
        ok: false,
        message: 'fail'
    }
  ```

</details>