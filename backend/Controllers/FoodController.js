const ObjectId = require ('mongoose').Types.ObjectId

const Food = require ('../Model/FoodModel')

const getTokenHelper = require ('../Model/FoodModel')
const getUserByTokenHelper = require ('../Helpers/CreateUserTokenHelper')

class FoodController {
    static async create (requisition, response) {
        const { name, sauce, salad, hamburguer } = requisition.body
        const images = requisition.files || []
        const available = true

        if (!name) {
            return response.status (422).json ({ message: 'O nome é obrigatório!' })
        }
        if (!sauce) {
            return response.status (422).json ({ message: 'O molho é obrigatório!' })
        }
        if (!salad) {
            return response.status (422).json ({ message: 'A salada é obrigatória!' })
        }
        if (!hamburguer) {
            return response.status (422).json ({ message: 'O Hamburguer é obrigatória!' })
        }
        if (images.length === 0) {
            return response.status (422).json ({ message: 'A imagem é obrigatória!' })
        }

        const token = getTokenHelper (requisition)
        const user = await getUserByTokenHelper (token)

        const food = new Food ({
            name,
            sauce,
            salad,
            hamburguer,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone
            }
        })

        images.forEach ((image) => {
            food.images.push (image.filename)
        })

        try {
            const newFood = await food.save()
            return response.status (201).json ({ message: "Sanduiche cadastrado com sucesso!", newFood })
        } catch (error) {
            return response.status (500).json ({ message: error.message })
        }
    }

    static async getAll (requisition, response) {
        const foods = await Food.find().sort ('-createdAt')

        return response.status (200).json ({ foods: foods })
    }

    static async getAllUserFoods (requisition, response) {
        const token = getTokenHelper (requisition)
        const user = await getUserByTokenHelper (token)

        const foods = await Food.find ({ 'user._id': user._id }).sort ('-createdAt')

        return response.status (200).json ({ foods: foods })
    }

    static async getAllUserClients (requisition, response) {
        const token = getTokenHelper (requisition)
        const user = await getUserByTokenHelper (token)

        const foods = await Food.find ({ 'adopter._id': user._id }).sort ('-createdAt')

        return response.status (200).json ({ foods: foods })
    }

    static async getFoodById (requisition, response) {
        const id = requisition.params.id

        if (!ObjectId.isValid (id)) {
            return response.status (422).json ({ message: 'ID inválido!' })
        }

        const food = await Food.findOne ({ _id: id })

        if (!food) {
            return response.status (404).json ({ message: 'Hamburguer não encontrado!' })
        }

        return response.status (200).json ({ food: food })
    }

    static async removeFoodById (requisition, response) {
        const id = requisition.params.id

        if (!ObjectId.isValid (id)) {
            return response.status (422).json ({ message: 'ID inválido!' })
        }

        const food = await Food.findOne ({ _id: id })

        if (!food) {
            return response.status (404).json ({ message: 'Hamburguer não encontrado!' })
        }

        const token = getTokenHelper (requisition)
        const user = await getUserByTokenHelper (token)

        if (food.user._id.toString() !== user._id.toString()) {
            return response.status (403).json ({ message: 'Problema de solitação, tente novamente!' })
        }

        await Food.findByIdAndDelete (id)

        return response.status (204).json ({ message: 'Hamburguer removido com sucesso!' })
    }

    static async updateFood (requisition, response) {
        const id = requisition.params.id

        const { name, sauce, salad, hamburguer, available } = requisition.body

        const images = requisition.files

        const updatedData = {}

        const food = await Food.findOne ({ _id: id })

        if (!food) {
            return response.status (404).json ({ message: 'Hamburguer não encontrado!' })
        }

        const token = getTokenHelper (requisition)
        const user = await getUserByTokenHelper (token)

        if (food.user._id.toString() !== user._id.toString()) {
            return response.status (403).json ({ message: 'Problema de solitação, tente novamente!' })
        }

        if (!name) {
            return response.status (422).json ({ message: 'O nome é obrigatório!' })
        } else {
            updatedData.name = name
        }
        if (!sauce) {
            return response.status (422).json ({ message: 'O molho é obrigatório!' })
        } else {
            updatedData.sauce = sauce
        }
        if (!salad) {
            return response.status (422).json ({ message: 'A salada é obrigatória!' })
        } else {
            updatedData.salad = salad
        }
        if (!hamburguer) {
            return response.status (422).json ({ message: 'O hamburguer é obrigatório!' })
        } else {
            updatedData.hamburguer = hamburguer
        }

        if (images.length === 0) {
            return response.status (422).json ({ message: 'A imagem é obrigatória!' })
        } else {
            updatedData.images = []
            images.forEach ((image) => {
                updatedData.images.push (image.filename)
            })
        }

        await Food.findByIdAndUpdate (id, updatedData)

        return response.status (204).json ({ message: 'Hamburguer atualizado com sucesso!' })
    }
    static async concludeOrder (requisition, response) {
        const id = requisition.params.id

        const food = await Food.findOne ({ _id: id })

        if (!food) {
            return response.status (404).json ({ message: 'Hamburguer não encontrado!' })
        }

        const token = getTokenHelper (requisition)
        const user = await getUserByTokenHelper (token)

        if (food.user._id.toString() === user._id.toString()) {
            return response.status (422).json ({ message: 'Erro de solicitação, tente novamente!' })
        }

        food.available = false

        await Food.findByIdAndUpdate (id, food)

        return response.status (200).json ({ message: 'Pedido concluido com sucesso!' })
    }
}

module.exports = FoodController