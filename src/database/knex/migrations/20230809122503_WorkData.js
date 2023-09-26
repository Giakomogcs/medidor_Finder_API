
exports.up = knex => knex.schema.createTable("workdata", table => {
    table.increments("id")
    table.integer("machine_id").references("id").inTable("machines")
    table.float("Pt")
    table.float("Qt")
    table.float("St")
    table.float("PFt")
    table.float("Frequency")
    table.float("U1")
    table.float("U2")
    table.float("U3")
    table.float("I1")
    table.float("I2")
    table.float("I3")
    table.timestamp("timestamp", { useTz: true }).default(knex.fn.now())
});
  

exports.down = knex => knex.schema.dropTable("workdata");
