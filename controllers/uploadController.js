export const upload = async (req, res) => {
    try {
        res.status(200).json({ url: `/uploads/${req.file.originalname}` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ messase: "Something went wrong" });
    }
};
