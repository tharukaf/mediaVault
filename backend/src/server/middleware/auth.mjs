import jwt from 'jsonwebtoken'
import { getUserByEmail } from '../../db/models/userModel.mjs'

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await getUserByEmail(decoded.email)

        if (!user) {
            return res.status(401).json({ error: 'Invalid token - user not found' })
        }

        req.user = {
            id: user._id,
            email: user.email,
            name: user.name
        }
        next()
    } catch (error) {
        console.error('Token verification error:', error)
        return res.status(403).json({ error: 'Invalid or expired token' })
    }
}

export const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        req.user = null
        return next()
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await getUserByEmail(decoded.email)

        if (user) {
            req.user = {
                id: user._id,
                email: user.email,
                name: user.name
            }
        } else {
            req.user = null
        }
    } catch (error) {
        req.user = null
    }

    next()
}
