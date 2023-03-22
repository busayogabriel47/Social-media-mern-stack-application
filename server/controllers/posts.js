import express, { Router } from 'express';
import mongoose from 'mongoose';
import PostMessages from "../Models/postModel.js";


const router = express.Router();


export const getPosts = async (req, res) => {
   try {
        const postMessages = await PostMessages.find();
        res.status(200).json(postMessages);
   } catch (error) {
        res.status(404).json({message: error.message})    
   }
}

export const getPost = async (req, res) => {
    const {id} = req.params;

    try {
        const post = await PostMessages.findById(id);

        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export const createPost = async (req, res) => {
    const post = req.body

    const newPostMessage = new PostMessages({...post, creator: req.userId, createdAt: new Date().toISOString()});

    try {
        await newPostMessage.save();
        res.status(201).json(newPostMessage);
    } catch (error) {
        res.status(409).json({message: error.message})
    }
}

export const updatePost = async (req, res)=> {
    const {id} = req.params;
    const {title, message, creator, selectedFile, tags} = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`)

    const updatePost = {creator, title, message, tags, selectedFile, _id: id};

    await PostMessages.findByIdAndUpdate(id, updatePost, {new: true});

    res.json(updatePost);
}


export const deletePost = async(req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessages.findByIdAndRemove(id);

    res.json({message: "Post deleted successfully."})
}

export const likePost = async (req, res) => {
    const {id} = req.params;

    if(!req.userId) return res.json({message: 'Unauthenticated'})
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const post = await PostMessages.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if(index === -1){
        post.likes.push(req.userId);
    }else {
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatePost = await PostMessages.findByIdAndUpdate(id, post, {new: true});

    res.status(200).json(updatePost);
}


export default router;

