import Inquiry from '../models/Inquiry.js';
import nodemailer from 'nodemailer';

const sendNotificationEmail = async (inquiry) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
      <div style="background:#1a4731;padding:24px 32px;">
        <h2 style="color:#c9a84c;margin:0;font-size:22px;">New Inquiry — Sere Lanka Tours</h2>
      </div>
      <div style="padding:32px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#666;width:160px;"><strong>Name</strong></td><td style="padding:8px 0;color:#1a1a1a;">${inquiry.fullName}</td></tr>
          <tr><td style="padding:8px 0;color:#666;"><strong>Email</strong></td><td style="padding:8px 0;"><a href="mailto:${inquiry.email}" style="color:#1a6e8a;">${inquiry.email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#666;"><strong>WhatsApp</strong></td><td style="padding:8px 0;"><a href="https://wa.me/${inquiry.whatsapp.replace(/\D/g,'')}" style="color:#25D366;font-weight:bold;">${inquiry.whatsapp}</a></td></tr>
          <tr><td style="padding:8px 0;color:#666;"><strong>Country</strong></td><td style="padding:8px 0;color:#1a1a1a;">${inquiry.country}</td></tr>
          <tr><td style="padding:8px 0;color:#666;"><strong>Package</strong></td><td style="padding:8px 0;color:#1a1a1a;">${inquiry.packageInterested}</td></tr>
          <tr><td style="padding:8px 0;color:#666;"><strong>Travel Start</strong></td><td style="padding:8px 0;color:#1a1a1a;">${inquiry.travelStartDate || '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#666;"><strong>Travel End</strong></td><td style="padding:8px 0;color:#1a1a1a;">${inquiry.travelEndDate || '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#666;"><strong>Group Size</strong></td><td style="padding:8px 0;color:#1a1a1a;">${inquiry.groupSize} person(s)</td></tr>
        </table>
        <div style="margin-top:20px;padding:16px;background:#f9f5ee;border-radius:6px;border-left:4px solid #c9a84c;">
          <strong style="color:#1a4731;">Message:</strong>
          <p style="margin:8px 0 0;color:#4a4a4a;">${inquiry.message || '(no message)'}</p>
        </div>
        <div style="margin-top:24px;display:flex;gap:12px;">
          <a href="https://wa.me/${inquiry.whatsapp.replace(/\D/g,'')}" style="display:inline-block;padding:12px 24px;background:#25D366;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">Open WhatsApp</a>
          <a href="mailto:${inquiry.email}" style="display:inline-block;padding:12px 24px;background:#1a4731;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">Send Email</a>
        </div>
      </div>
      <div style="padding:16px 32px;background:#f9f5ee;color:#999;font-size:12px;text-align:center;">
        Sere Lanka Tours — Admin Notification
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Sere Lanka Tours" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `New Inquiry from ${inquiry.fullName} (${inquiry.country}) — ${inquiry.packageInterested}`,
    html,
  });
};

export const createInquiry = async (req, res) => {
  try {
    const { fullName, email, whatsapp, country, packageInterested, travelStartDate, travelEndDate, groupSize, message } = req.body;
    if (!fullName || !email || !whatsapp || !country) {
      return res.status(400).json({ success: false, message: 'Name, email, WhatsApp and country are required' });
    }
    const inquiry = await Inquiry.create({ fullName, email, whatsapp, country, packageInterested, travelStartDate, travelEndDate, groupSize, message });
    sendNotificationEmail(inquiry).catch(err => console.error('Email notification failed:', err));
    res.status(201).json({ success: true, message: 'Inquiry submitted successfully', data: inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllInquiries = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: inquiries, total: inquiries.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['New', 'Contacted', 'Closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    res.json({ success: true, data: inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
