import db from "../db/db";

export async function getTotalRows(tableName: string): Promise<number> {
  try {
    const [rows]: any = await db.query(`SELECT COUNT(*) as total FROM ??`, [
      tableName,
    ]);
    const totalRows = rows[0].total;
    console.log(totalRows);

    return totalRows;
  } catch (error) {
    console.error("Error fetching total rows:", error);
    throw error;
  }
}
