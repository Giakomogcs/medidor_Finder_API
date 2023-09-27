const AppError = require("../utils/AppError")
const knex = require("../database/knex");


class WorkDataController{
    
    async create(request,response){
      let {machine_id, Pt, Qt, St, PFt, Frequency, U1, U2, U3, I1, I2, I3} = request.body
      
      const machine = await knex("machines").where({id:machine_id}).first()
      
      if(!machine){
        throw new AppError("Não foi possível encontrar a máquina (machine_id)")
      }

      
      if(!machine_id){
        throw new AppError("Nome da máquina (machine_id) é obrigatório")
      }

      const zDate = new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        dateStyle: 'short',
        timeStyle: 'medium'
      });

      const timestamp = zDate

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
        timestamp
      });
            
      return response.json();
    }
    
    async status(request,response){
      const{name} = request.params
      
      let datas
      
      const machine = await knex("machines").where({name}).first()

      if (!machine){
        throw new AppError("Não foi possível encontrar a máquina (machine_id)")
      }
      
      else{
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
          "workdata.timestamp"
        ])
        .where("workdata.machine_id", machine.id)
        .groupBy("workdata.timestamp")
        .orderBy("workdata.timestamp", 'desc')
        .first()
      }

      return response.json({
        datas
      })
  
    }



    async hist(request,response){
      const{name} = request.params
      let {start, end} = request.query;

      //start ? start = start : start = new Date().getDate() -2
      //end ? end = end : end = new Date().toLocaleDateString() 

      
      
      if (!start) {
        // Se start não foi fornecido na query, defina-o como dois dias atrás do dia atual.
        const oneDaysAgo = new Date();
        oneDaysAgo.setDate(oneDaysAgo.getDate() - 1);
        start = oneDaysAgo.toLocaleString("pt-BR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      }
      
      if (!end) {
        // Se end não foi fornecido na query, defina-o como o dia atual.
        const currentDate = new Date();
        end = currentDate.toLocaleString("pt-BR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      }
      
      let datas
      
      const machine = await knex("machines").where({name}).first()

      if (!machine){
        throw new AppError("Não foi possível encontrar a máquina (machine_id)")
      }
      
      else{
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
          "workdata.timestamp"
        ])
        .where("workdata.machine_id", machine.id)
        .where('workdata.timestamp', '>=', start)
        .where('workdata.timestamp', '<=', end)
        .groupBy("workdata.timestamp")
        .orderBy("workdata.timestamp", 'desc')
      }
      
      return response.json({
        datas
      })
  
    }

  }
  module.exports = WorkDataController