import express from "express";
import multer from "multer";
import { Festival } from "../models/festival";

// ── Multer configuration ────────────────────────────────────────────────────────

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Apenas imagens são permitidas (image/*)."));
    }
  },
});

/** Middleware — parses a single file from the "cartaz" field. */
export const uploadCartaz = upload.single("cartaz");

// ── Helpers ─────────────────────────────────────────────────────────────────────

/**
 * Parses a field from multipart form-data that may have been JSON-stringified
 * by the client. If the value is already a plain object (JSON request), it is
 * returned as-is.
 */
function parseField<T>(value: unknown): T {
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }
  return value as T;
}

/**
 * Builds the response DTO for a festival, excluding the raw cartaz buffer
 * and adding a `cartazUrl` when an image exists.
 */
function toResponseDTO(festival: Record<string, unknown>) {
  const obj = { ...festival };
  delete obj.cartaz; // remove the whole cartaz field (data + contentType)
  return {
    ...obj,
    cartazUrl: festival.cartaz
      ? `/festival/${festival._id}/cartaz`
      : undefined,
  };
}

// ── Controller ──────────────────────────────────────────────────────────────────

class FestivalController {
  /** GET /festival — list all festivals (without cartaz data) */
  getFestivais = async (req: express.Request, res: express.Response) => {
    try {
      const festivais = await Festival.find().select("-cartaz.data");
      const data = festivais.map((f) => toResponseDTO(f.toObject()));
      return res.status(200).json({ data });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro ao obter festivais.", error });
    }
  };

  /** GET /festival/:id — get a single festival (without cartaz data) */
  getFestivalById = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const festival = await Festival.findById(id).select("-cartaz.data");

      if (!festival) {
        return res.status(404).json({ message: "Festival não encontrado." });
      }

      return res.status(200).json({ data: toResponseDTO(festival.toObject()) });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro ao obter festival.", error });
    }
  };

  /** GET /festival/:id/cartaz — serve the raw cartaz image binary */
  getCartaz = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const festival = await Festival.findById(id).select("cartaz");

      if (!festival || !festival.cartaz?.data) {
        return res.status(404).json({ message: "Cartaz não encontrado." });
      }

      res.set("Content-Type", festival.cartaz.contentType ?? "image/png");
      res.set("Cache-Control", "public, max-age=31536000, immutable");
      return res.send(festival.cartaz.data);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro ao obter cartaz.", error });
    }
  };

  /** POST /festival — create a festival, optionally with a cartaz image */
  createFestival = async (req: express.Request, res: express.Response) => {
    try {
      const tuna = parseField<{ name: string }>(req.body.tuna);
      const premios = parseField<{ name: string }[]>(req.body.premios);
      const tunasConcurso = parseField<{ name: string }[]>(
        req.body.tunasConcurso,
      );
      const tunasExtra = parseField<{ name: string }[]>(req.body.tunasExtra);

      const festival = new Festival({
        name: req.body.name,
        tuna,
        location: req.body.location,
        date: req.body.date,
        premios,
        tunasConcurso,
        tunasExtra,
      });

      // Attach uploaded cartaz if present
      if (req.file) {
        festival.cartaz = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }

      await festival.save();

      return res.status(201).json({
        message: "Festival criado com sucesso.",
        data: toResponseDTO(festival.toObject()),
      });
    } catch (error: unknown) {
      if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ message: "O ficheiro é demasiado grande. O limite é 5 MB." });
      }
      // multer file-filter error thrown as a plain Error
      if (error instanceof Error && error.message.includes("Apenas imagens")) {
        return res.status(400).json({ message: error.message });
      }
      return res
        .status(400)
        .json({ message: "Erro ao criar festival.", error });
    }
  };

  /** PUT /festival/:id — update a festival, optionally replacing the cartaz */
  updateFestival = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;

      const tuna = parseField<{ name: string }>(req.body.tuna);
      const premios = parseField<{ name: string }[]>(req.body.premios);
      const tunasConcurso = parseField<{ name: string }[]>(
        req.body.tunasConcurso,
      );
      const tunasExtra = parseField<{ name: string }[]>(req.body.tunasExtra);

      const updateData: Record<string, unknown> = {
        name: req.body.name,
        tuna,
        location: req.body.location,
        date: req.body.date,
        premios,
        tunasConcurso,
        tunasExtra,
      };

      // Replace cartaz if a new file was uploaded
      if (req.file) {
        updateData.cartaz = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }

      const festival = await Festival.findByIdAndUpdate(id, updateData, {
        new: true,
      }).select("-cartaz.data");

      if (!festival) {
        return res.status(404).json({ message: "Festival não encontrado." });
      }

      return res.status(200).json({
        message: "Festival atualizado com sucesso.",
        data: toResponseDTO(festival.toObject()),
      });
    } catch (error: unknown) {
      if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ message: "O ficheiro é demasiado grande. O limite é 5 MB." });
      }
      if (error instanceof Error && error.message.includes("Apenas imagens")) {
        return res.status(400).json({ message: error.message });
      }
      return res
        .status(400)
        .json({ message: "Erro ao atualizar festival.", error });
    }
  };

  /** DELETE /festival/:id */
  deleteFestival = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      await Festival.findByIdAndDelete(id);
      return res
        .status(200)
        .json({ message: "Festival eliminado com sucesso." });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Erro ao eliminar festival.", error });
    }
  }
}

export default new FestivalController();

