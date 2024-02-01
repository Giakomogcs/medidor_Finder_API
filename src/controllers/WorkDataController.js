const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class WorkDataController {
  async create(request, response) {
    let { machine_id, Pt, Qt, St, PFt, Frequency, U1, U2, U3, I1, I2, I3 } =
      request.body;

    const machine = await knex("machines").where({ id: machine_id }).first();

    if (!machine) {
      throw new AppError("Não foi possível encontrar a máquina (machine_id)");
    }

    if (!machine_id) {
      throw new AppError("Nome da máquina (machine_id) é obrigatório");
    }

    const zDate = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      dateStyle: "short",
      timeStyle: "medium",
    });

    const timestamp = zDate;

    await knex("workdata").insert({
      machine_id,
      Pt,
      Qt,
      St,
      PFt,
      Frequency,
      U1,
      U2,
      U3,
      I1,
      I2,
      I3,
      timestamp,
    });

    return response.json();
  }

  async status(request, response) {
    const { name } = request.params;

    let datas;

    const machine = await knex("machines").where({ name }).first();

    if (!machine) {
      throw new AppError("Não foi possível encontrar a máquina (machine_id)");
    } else {
      datas = await knex("workdata")
        .select([
          "workdata.machine_id",
          "workdata.Pt",
          "workdata.Qt",
          "workdata.St",
          "workdata.PFt",
          "workdata.Frequency",
          "workdata.U1",
          "workdata.U2",
          "workdata.U3",
          "workdata.I1",
          "workdata.I2",
          "workdata.I3",
          "workdata.timestamp",
        ])
        .where("workdata.machine_id", machine.id)
        .groupBy("workdata.timestamp")
        .orderBy("workdata.id", "desc")
        .first();
    }

    return response.json({
      datas,
    });
  }

  async hist(request, response) {
    const { name } = request.params;
    let { start, end } = request.query;

    if (!start) {
      const oneDaysAgo = new Date();
      oneDaysAgo.setDate(oneDaysAgo.getDate() - 1);
      start = oneDaysAgo;
    }

    if (!end) {
      const currentDate = new Date();
      end = currentDate;
    }

    // Converte as strings em objetos Date diretamente
    const startDate = new Date(start);
    const endDate = new Date(end);

    let datas;

    const machine = await knex("machines").where({ name }).first();

    if (!machine) {
      throw new AppError("Não foi possível encontrar a máquina (machine_id)");
    } else {
      datas = await knex("workdata")
        .select([
          "workdata.machine_id",
          "workdata.Pt",
          "workdata.Qt",
          "workdata.St",
          "workdata.PFt",
          "workdata.Frequency",
          "workdata.U1",
          "workdata.U2",
          "workdata.U3",
          "workdata.I1",
          "workdata.I2",
          "workdata.I3",
          "workdata.timestamp",
        ])
        .where("workdata.machine_id", machine.id)
        .groupBy("workdata.id")
        .orderBy("workdata.id", "desc");
    }

    const dataInRange = datas.filter((data) => {
      const timestamp = new Date(
        data.timestamp.replace(
          /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}:\d{2}:\d{2})/,
          "$3-$2-$1T$4.000Z"
        )
      );
      return timestamp >= startDate && timestamp <= endDate;
    });

    datas = dataInRange;

    return response.json({
      datas,
    });
  }
}
module.exports = WorkDataController;
