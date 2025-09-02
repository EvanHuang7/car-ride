import { neon } from "@neondatabase/serverless";

// NOTE: Run this SQL to create a rides table in "SQL Editor" of Neon DB Project
// CREATE TABLE rides (
//     ride_id SERIAL PRIMARY KEY,
//     origin_address VARCHAR(255) NOT NULL,
//     destination_address VARCHAR(255) NOT NULL,
//     origin_latitude DECIMAL(9, 6) NOT NULL,
//     origin_longitude DECIMAL(9, 6) NOT NULL,
//     destination_latitude DECIMAL(9, 6) NOT NULL,
//     destination_longitude DECIMAL(9, 6) NOT NULL,
//     ride_time INTEGER NOT NULL,
//     fare_price DECIMAL(10, 2) NOT NULL CHECK (fare_price >= 0),
//     payment_status VARCHAR(20) NOT NULL,
//     driver_id INTEGER REFERENCES drivers(id),
//     user_id VARCHAR(100) NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      origin_address,
      destination_address,
      origin_latitude,
      origin_longitude,
      destination_latitude,
      destination_longitude,
      ride_time,
      fare_price,
      payment_status,
      driver_id,
      user_id,
    } = body;

    if (
      !origin_address ||
      !destination_address ||
      !origin_latitude ||
      !origin_longitude ||
      !destination_latitude ||
      !destination_longitude ||
      !ride_time ||
      !fare_price ||
      !payment_status ||
      !driver_id ||
      !user_id
    ) {
      return Response.json(
        { error: "Missing required fields" },
        // eslint-disable-next-line prettier/prettier
        { status: 400 }
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    const response = await sql`
      INSERT INTO rides ( 
          origin_address, 
          destination_address, 
          origin_latitude, 
          origin_longitude, 
          destination_latitude, 
          destination_longitude, 
          ride_time, 
          fare_price, 
          payment_status, 
          driver_id, 
          user_id
      ) VALUES (
          ${origin_address},
          ${destination_address},
          ${origin_latitude},
          ${origin_longitude},
          ${destination_latitude},
          ${destination_longitude},
          ${ride_time},
          ${fare_price},
          ${payment_status},
          ${driver_id},
          ${user_id}
      )
      RETURNING *;
    `;

    return Response.json({ data: response[0] }, { status: 201 });
  } catch (error) {
    console.error("Error inserting data into recent_rides:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
