const express = require("express");
const Contact = require("../models/contactModel");
const fs = require("fs");

const {
    convertJson2Csv,
    convertCsv2Json,
} = require("../services/utils/convert-2-JSON-or-CSV");

const advanceFiltering = (req) => {
    const requestedQuery = req.query;
    const userID = req.userID;

    if (typeof requestedQuery !== "object") {
        return {};
    }
    const {fields, sort, page = 1, limit = 10, ...filters} = requestedQuery;
    const query = {};
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

        query.filters.user = userID;
        // checking for the user specific contacts list
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
            query.limit = 0;
        }
    }
    return query;
};

const singlePostController = async (req, res) => {
    const {firstName, lastName, email, phone, address} = req.body;
    const contact = new Contact({
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        email: email?.trim(),
        phone: phone?.trim(),
        address: address?.trim(),
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
        const query = advanceFiltering(req);

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
            // query,
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

const getSingleContactController = async (req, res) => {
    const id = req.params.id;
    try {
        const contact = await Contact.findById(id);

        if (contact.user.toString() === req.userID) {
            res.status(200).json({
                status: 200,
                data: contact,
            });
            await Contact.findOneAndUpdate(
                {_id: id},
                {
                    $set: {
                        frequency: contact?.frequency
                            ? contact?.frequency + 1
                            : 1,
                    },
                }
            );
        } else {
            res.status(401).json({
                status: 401,
                msg: "Access Denied!",
                deletedCount: 0,
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            msg: "Something is wrong. Please try again!",
            deletedCount: 0,
        });
    }
};

const deleteContactController = async (req, res) => {
    const id = req.params.id;
    try {
        const contact = await Contact.findById(id);
        // checking is this contact is created by this user
        if (contact.user.toString() === req.userID) {
            const data = await Contact.deleteOne({_id: id});
            if (data?.deletedCount) {
                res.status(200).json({
                    status: 200,
                    msg: "Delete Successful.",
                    deletedCount: 1,
                });
            } else {
                res.status(424).json({
                    status: 424,
                    msg: "Delete Unsuccessful! Contact not found.",
                    deletedCount: 0,
                });
            }
        } else {
            // a person can't delete others contact
            res.status(401).json({
                status: 401,
                msg: "Access Denied!",
                deletedCount: 0,
            });
        }
    } catch (err) {
        res.status(424).json({
            status: 424,
            msg: "Delete Unsuccessful! Please try again.",
            deletedCount: 0,
        });
    }
};

const updateContactController = async (req, res) => {
    const id = req.params.id;
    const {firstName, lastName, email, imgUrl, phone, address} = req.body;

    try {
        const contact = await Contact.findById(id);

        if (contact.user.toString() === req.userID) {
            const fields = {
                firstName: firstName?.trim(),
                lastName: lastName?.trim(),
                email: email?.trim(),
                phone: phone?.trim(),
                address: address?.trim(),
                imgUrl: imgUrl?.trim(),
            };

            let displayName = firstName?.trim()
                ? firstName?.trim()
                : contact?.firstName;
            displayName += " ";
            displayName += lastName?.trim()
                ? lastName?.trim()
                : contact?.lastName;
            fields.displayName = displayName.trim();

            if (!fields.displayName?.trim()) {
                res.status(200).json({
                    errors: {
                        firstName: {
                            value: "",
                            msg: "First Name or Last Name should be filled.",
                            param: "firstName",
                            location: "body",
                        },
                    },
                });
            } else {
                const newContact = await Contact.findOneAndUpdate(
                    {_id: id},
                    {$set: fields},
                    {new: true}
                );

                res.status(200).json({
                    status: 200,
                    msg: "Successfully Updated!",
                    fields: fields,
                    data: newContact,
                });
            }
        } else {
            res.status(401).json({
                status: 401,
                msg: "Access Denied!",
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            msg: "Something is wrong. Please try again!",
        });
    }
};

const exportContactsController = async (req, res) => {
    try {
        const contacts = await Contact.find({
            user: req.userID,
        }).select("-_id -__v -createdAt -updatedAt -frequency -user ");
        const fields = [
            "firstName",
            "lastName",
            "displayName",
            "email",
            "phone",
            "address",
            "imgUrl",
        ];
        const path = convertJson2Csv({
            data: contacts,
            fields: fields,
            path: `./My Contacts.csv`,
        });

        return res.download(path, () => {
            fs.unlinkSync(path); // will delete the csv file after download
        });
    } catch {
        res.status(500).json({
            status: 500,
            msg: "Something is wrong. Please try again!",
        });
    }
};

const importContactsController = async (req, res) => {
    try {
        const path = req.file.path;
        const jsonData = await convertCsv2Json(path);

        const data = jsonData.map((contact) => {
            contact.user = req.userID;
            return contact;
        });

        const result = await Contact.insertMany(data);
        res.status(200).send({
            status: 200,
            inserted: 0,
            msg: "Contact list added!",
            result,
        });

        fs.unlinkSync(path); // will delete the csv file after insertion
    } catch {
        res.status(500).json({
            status: 500,
            msg: "Something is wrong. Please try again!",
        });
    }
};

module.exports = {
    singlePostController,
    getQueryController,
    deleteContactController,
    getSingleContactController,
    updateContactController,
    exportContactsController,
    importContactsController,
};
