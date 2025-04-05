
import os
import streamlit as st
import PyPDF2
from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
