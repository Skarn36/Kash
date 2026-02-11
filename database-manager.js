import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import { db } from "./database-config.js";

const COLLECTION_NAME = "transacoes";

//SALVAR: Cria uma nova transação vinculada ao UID do Google/

export const saveTransaction = async (
  userId,
  { descricao, valor, categoria, tipo }
) => {
  if (!userId) throw new Error("Usuário não autenticado.");

  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      userId,
      descricao: descricao || "Sem descrição",
      valor: Number(valor) || 0,
      categoria: categoria || "Outros",
      tipo: tipo || "saida",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Erro ao salvar no Firestore:", error.message);
    throw error;
  }
};

// LISTAR: Busca apenas as transações do usuário logado//

export const getTransactionHistory = async (userId) => {
  if (!userId) return [];

  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,

        // Garante que a data não quebre se o Firestore ainda não tiver gerado o timestamp
        date: data.createdAt?.toDate() || new Date(),
      };
    });
  } catch (error) {
    console.error("Erro ao buscar histórico:", error.message);
    return [];
  }
};

//RESUMO: Calcula saldo, receitas e despesas automaticamente//

export const getFinancialSummary = async (userId) => {
  try {
    const transacoes = await getTransactionHistory(userId);

    return transacoes.reduce(
      (acc, item) => {
        const valor = Number(item.valor) || 0;
        if (item.tipo === "entrada") {
          acc.receitas += valor;
          acc.saldo += valor;
        } else {
          acc.despesas += valor;
          acc.saldo -= valor;
        }
        return acc;
      },
      { saldo: 0, receitas: 0, despesas: 0 }
    );
  } catch (error) {
    console.error("Erro ao processar resumo financeiro:", error);
    return { saldo: 0, receitas: 0, despesas: 0 };
  }
};

// ATUALIZAR: Edita um documento existente/

export const updateTransaction = async (transactionId, updatedData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, transactionId);
    await updateDoc(docRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Erro ao atualizar documento:", error.message);
    throw error;
  }
};

//DELETAR: Remove um documento do banco/

export const deleteTransaction = async (transactionId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, transactionId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Erro ao deletar documento:", error.message);
    throw error;
  }
};
