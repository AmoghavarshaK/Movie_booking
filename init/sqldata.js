const insertVenues = async()=> {
    const sql = `
      INSERT INTO venues (vname, location, capacity) 
      VALUES 
        ('PVR Cinemas', 'New York, NY', 200),
        ('IMAX Theater', 'Los Angeles, CA', 300),
        ('Cineplex Odeon', 'Chicago, IL', 250),
        ('Regal Cinemas', 'Houston, TX', 180),
        ('AMC Theatres', 'San Francisco, CA', 220);
    `;
  
    try {
      const [result] = await db.query(sql);
      console.log("✅ Venues inserted successfully!", result);
    } catch (error) {
      console.error("❌ Error inserting venues:", error.message);
    } finally {
      db.end();
    }
  }