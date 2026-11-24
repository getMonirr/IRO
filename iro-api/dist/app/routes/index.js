"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auditLog_route_1 = require("../modules/AuditLog/auditLog.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const donation_route_1 = require("../modules/Donation/donation.route");
const joinRequest_route_1 = require("../modules/JoinRequest/joinRequest.route");
const listItem_route_1 = require("../modules/ListItem/listItem.route");
const post_route_1 = require("../modules/Post/post.route");
const program_route_1 = require("../modules/Program/program.route");
const public_route_1 = require("../modules/Public/public.route");
const setting_route_1 = require("../modules/Setting/setting.route");
const upload_route_1 = require("../modules/Upload/upload.route");
const user_route_1 = require("../modules/User/user.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    { path: '/public', route: public_route_1.PublicRoutes },
    { path: '/auth', route: auth_route_1.AuthRoutes },
    { path: '/donations', route: donation_route_1.DonationRoutes },
    { path: '/users', route: user_route_1.UserRoutes },
    { path: '/programs', route: program_route_1.ProgramRoutes },
    { path: '/posts', route: post_route_1.PostRoutes },
    { path: '/items', route: listItem_route_1.ListItemRoutes },
    { path: '/settings', route: setting_route_1.SettingRoutes },
    { path: '/join-requests', route: joinRequest_route_1.JoinRequestRoutes },
    { path: '/audit-logs', route: auditLog_route_1.AuditLogRoutes },
    { path: '/uploads', route: upload_route_1.UploadRoutes },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
