const express = require("express");
const Contact = require("../models/contactModel");

const advanceFiltering = (requestedQuery) => {
    if (typeof requestedQuery !== "object") {
        return {};
    }
    const {fields, sort, page = 1, limit = 10, ...filters} = requestedQuery;
    const query = {page, limit};
    if (filters) {
        let filterStr = JSON.stringify(filters);
        // operators -> gt gte lt lte eq in ne nin and not nor or exists
        // in use->
        //      price is greater then 50 price[gt]=50
        //      price is not greater then 50 price[nt][gt]=50

        filterStr = filterStr.replace(
            /\b(gt|gte|lt|lte|eq|in|ne|nin|and|not|nor|or|exists)\b/g,
            (match) => `$${match}`
            // if any match than add $ sign before the match
        );

        query.filters = JSON.parse(filterStr); //New filters Object
    }
    if (sort) {
        const sortBy = sort.split(",").join(" ");
        query.sort = sortBy;
    }
    if (fields) {
        const selectedFields = fields.split(",").join(" ");
        query.fields = selectedFields;
    }
    if (page) {
        const pages = parseInt(page);
        if (pages !== 0 && pages !== NaN && pages !== null) {
            const skip = (pages - 1) * parseInt(limit);

            query.skip = skip;
            query.limit = parseInt(limit);
            query.page = pages;
        } else {
            query.skip = 0;
            query.page = 0;
        }
    }
    return query;
};

const singlePostController = async (req, res) => {
    const {firstName, lastName, email, phone, address} = req.body;
    const contact = new Contact({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        imgUrl: "common/MaleAvatar.png",
        user: req.userID,
    });

    try {
        const data = await contact.save();

        res.status(200).send({
            msg: "Contact Saved Successfully!",
            data: {
                ...data._doc,
            },
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

const getQueryController = async (req, res) => {
    try {
        const query = advanceFiltering(req.query);

        const totalCount = await Contact.countDocuments(query.filters);

        if (query.page === 0) {
            query.limit = totalCount;
        }

        const contacts = await Contact.find(query.filters)
            .select(query.fields)
            .sort(query.sort)
            .skip(query.skip)
            .limit(query.limit);

        res.status(200).send({
            query,
            dataCount: contacts.length,
            totalDataCount: totalCount,
            currentPage: query.page ? query.page : 1,
            totalPage: Math.ceil(totalCount / query.limit),
            data: contacts,
        });
    } catch (err) {
        res.status(400).send({
            msg: err,
        });
    }
};

module.exports = {
    singlePostController,
    getQueryController,
};
