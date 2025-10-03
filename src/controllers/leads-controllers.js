import { supabase } from "../lib/supabase.js"; // seu client Supabase

let dbInitialized = false;
async function ensureDbConnection() {
  if (!dbInitialized) {
    dbInitialized = true;
  }
}

// GET /api/leads
export const getLeads = async (req, res) => {
  await ensureDbConnection();

  try {
    const { data, error } = await supabase
      .from('BluenSDR') // verifique se a tabela existe exatamente assim
      .select("*")
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
    console.log(data);
  } catch (error) {
    console.error("Error fetching leads:", error.message);
    res.status(500).json({ error: "Failed to fetch leads" });
  }
};

// GET /api/leads/:id
export const getLeadById = async (req, res) => {
  await ensureDbConnection();

  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('BluenSDR') // sem aspas
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch lead" });
  }
};

// POST /api/leads
export const createLead = async (req, res) => {
  await ensureDbConnection();

  try {
    const { data, error } = await supabase
       .from('BluenSDR') // sem aspas
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create lead" });
  }
};

// PUT /api/leads/:id
export const updateLead = async (req, res) => {
  await ensureDbConnection();

  try {
    const { numero } = req.params; // URL: /numero/:numero
    const numeroClean = numero.trim();

    console.log("Número recebido:", numeroClean);
    console.log("Body recebido:", req.body);

    // 🔹 Buscar lead existente
    const { data: leadExist, error: findError } = await supabase
      .from('BluenSDR')
      .select('*')
      .eq('numero', numeroClean) // agora minúsculo
      .single();

    if (findError) {
      console.error("Erro Supabase ao buscar lead:", findError);
      if (findError.code === 'PGRST116') {
        return res.status(404).json({ error: "Lead not found" });
      }
      throw findError;
    }

    console.log("Lead encontrado:", leadExist);

    // 🔹 Atualizar lead
    const { data: updatedLeads, error: updateError } = await supabase
      .from('BluenSDR')
      .update(req.body)
      .eq('numero', numeroClean) // agora minúsculo
      .select(); // retorna array

    if (updateError) {
      console.error("Erro Supabase ao atualizar:", updateError);
      return res.status(500).json({ error: "Failed to update lead" });
    }

    console.log("Lead atualizado:", updatedLeads);
    res.json(updatedLeads);
  } catch (error) {
    console.error("Erro catch:", error);
    res.status(500).json({ error: "Failed to update lead" });
  }
};



// DELETE /api/leads/:id
export const deleteLead = async (req, res) => {
  await ensureDbConnection();

  try {
    const { id } = req.params;
    const { error } = await supabase
       .from('BluenSDR') // sem aspas
      .delete()
      .eq("id", id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete lead" });
  }
};
