import CheckoutSummary from "../models/checkoutsummaryschema.js";

export const saveCheckoutSummary = async (req, res) => {
    try {
        const { userId, cartItems } = req.body;

        // Calculate subtotal
        const subtotal = cartItems.reduce(
            (acc, item) => {
                const discount = item.productId.discount || 0;
                const priceAfterDiscount = item.productId.price - (item.productId.price * discount / 100);
                return acc + priceAfterDiscount * item.quantity;
            }, 0);

        // Calculate discount based on subtotal
        let discount = 0;
        if (subtotal < 2000) {
            discount = subtotal * 0.05; // 5%
        } else if (subtotal >= 2000 && subtotal < 6000) {
            discount = subtotal * 0.10; // 10%
        } else if (subtotal >= 6000) {
            discount = subtotal * 0.15; // 15%
        }

        // Calculate shipping
        let shipping = 200;
        if (subtotal >= 6000) {
            shipping = 0; // Free shipping for 6000 and above
        } else if (subtotal >= 2000) {
            shipping = 100; // Reduced shipping
        }

        // Tax calculated on (subtotal - discount)
        const taxableAmount = subtotal - discount;
        const tax = taxableAmount * 0.18; // 18% GST

        // Total amount
        const totalAmount = taxableAmount + tax + shipping;

        // Check if checkout summary already exists for user
        let existingCheckout = await CheckoutSummary.findOne({ userId });

        if (existingCheckout) {
            // Update existing checkout summary
            existingCheckout.cartItems = cartItems;
            existingCheckout.subtotal = subtotal;
            existingCheckout.discount = discount;
            existingCheckout.shipping = shipping;
            existingCheckout.tax = tax;
            existingCheckout.totalAmount = totalAmount;

            await existingCheckout.save();

            res.status(200).json({ message: "Checkout summary updated", checkout: existingCheckout });
        } else {
            // Create new checkout summary
            const newCheckout = new CheckoutSummary({
                userId,
                cartItems,
                subtotal,
                discount,
                shipping,
                tax,
                totalAmount,
            });

            await newCheckout.save();

            res.status(201).json({ message: "Checkout summary saved", checkout: newCheckout });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to save checkout summary", error: error.message });
    }
};
