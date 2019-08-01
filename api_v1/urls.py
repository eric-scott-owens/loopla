from django.conf.urls import url, include
from rest_framework.authtoken import views as drf_views
from rest_auth import views as rest_auth_views
from rest_framework import routers
from api_v1.containers.auth.login.views import ObtainExpiringAuthToken
import api_v1.containers.auth.password_reset.views as password_reset_views
from api_v1.containers.category.views import CategoryViewSet, CategoryStatisticsViewSet
from api_v1.containers.commands.views import JavaScriptClientCommandViewSet
from api_v1.containers.comment.views import CommentViewSet, request_multiple_comments
from api_v1.containers.components.photo_collection.views import get_photo_collection_image, get_photo_collection_thumbnail
from api_v1.containers.feedback.views import UserFeedbackViewSet
from api_v1.containers.kudos.views import give_kudos, KudosViewSet, get_available_kudos
from api_v1.containers.kudos.kudos_given.views import KudosGivenViewSet, request_multiple_kudos_given
from api_v1.containers.loop.invitations.views import InvitationViewSet, record_invitation_email_opened, get_invitation_page, accept_invitation
from api_v1.containers.loop.multiUseInvitations.views import get_multi_use_invitation_page, accept_multi_use_invitation, get_multi_use_invitation_page_by_group, update_visibility_multi_use_invitation, create_new_multi_use_invitation_key
from api_v1.containers.loop.views import GroupViewSet, request_multiple_groups, get_loop_users
from api_v1.containers.loop.membership.views import MembershipViewSet
from api_v1.containers.loop.membership.add_loop_members.views import add_loop_members
from api_v1.containers.loop.membership.add_loop_administrator.views import add_loop_administrator
from api_v1.containers.loop.membership.change_membership_status.views import change_membership_status
from api_v1.containers.loop.membership.update_user_engagement_section.views import update_user_engagement_section
from api_v1.containers.place.views import PlaceViewSet, request_multiple_places
from api_v1.containers.post.views import PostViewSet, request_multiple_posts, get_post_data_newer_than, get_post_data_older_than
from api_v1.containers.registration.views import is_email_registered, is_username_registered, validate_new_password, register_new_user
from api_v1.containers.search.views import search_view, query_post_related_places, query_post_related_tags
from api_v1.containers.shop.catalog.views import CatalogItemViewSet
from api_v1.containers.shop.views import create_order, process_order
from api_v1.containers.tag.views import TagViewSet, get_suggested_tags_and_categories, request_multiple_tags
from api_v1.containers.telemetry.views import log_navigation_action, log_simple_action
from api_v1.containers.user.views import UserViewSet, CurrentUserView, request_multiple_users, search_users
from api_v1.containers.user.change_password.views import change_password
from api_v1.containers.user.summary_preferences.views import SummaryPreferencesViewSet
from api_v1.containers.user.tours_taken.views import report_taken_tour
from api_v1.containers.waitlist.views import WaitlistViewSet
from django.contrib.auth import views as auth_views
from django.views.generic import TemplateView, RedirectView

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'posts', PostViewSet, base_name='posts')
router.register(r'users', UserViewSet, base_name='users')
router.register(r'groups', GroupViewSet, base_name='group')
router.register(r'tags', TagViewSet, base_name='tags')
router.register(r'comments', CommentViewSet, base_name='comments')
router.register(r'places', PlaceViewSet, base_name='places')
router.register(r'invitations', InvitationViewSet, base_name='invitations')
router.register(r'memberships', MembershipViewSet, base_name='membership')
router.register(r'summary-preferences', SummaryPreferencesViewSet, base_name='summary-preferences')
router.register(r'waitlist', WaitlistViewSet, base_name="waitlist")
router.register(r'feedbacks', UserFeedbackViewSet, base_name="feedbacks")
router.register(r'catalog-items', CatalogItemViewSet, base_name="catalogitems")
router.register(r'kudos', KudosViewSet, base_name='kudos')
router.register(r'kudos-given', KudosGivenViewSet, base_name='kudos-given')
router.register(r'categorys', CategoryViewSet, base_name="categories")
router.register(r'category-statistics', CategoryStatisticsViewSet, base_name="category-statistics")
router.register(r'commands', JavaScriptClientCommandViewSet, base_name="commands")

urlpatterns = [
 #   url(r'^password-reset/confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
  #      TemplateView.as_view(template_name="password_reset_email.html"),
   #     name='password_reset_confirm'),

    url(r'^password_reset/$', password_reset_views.PasswordResetView.as_view(), 
        {
        'email_template_name': 'emails/password_reset_email.html',
        'html_email_template_name': 'emails/password_reset_email.html',
        }
    , name='password_reset'),

    url(r'^password_reset/done/$', password_reset_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    url(r'^reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        password_reset_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    url(r'^reset/done/$', password_reset_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),

    url(r'^', include('django.contrib.auth.urls')),
    url(r'^', include(router.urls)),
    url(r'^current-user/$', CurrentUserView.as_view(), name='current-user'),
    url(r'^auth$', drf_views.obtain_auth_token, name='auth'),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^user/login/', ObtainExpiringAuthToken.as_view(), name='login'),
    url(r'^user/change-password/$', change_password, name='change-password'),
    url(r'^user/report-taken-tour/$', report_taken_tour, name='report-taken-tour'),
    url(r'^user-kudos-count/$', UserViewSet.get_kudos_for_user, name='get-kudos-for-user'),
    url(r'^search/$', search_view, name='search'),
    url(r'^search/related-places/$', query_post_related_places, name='search-related-places'),
    url(r'^search/related-tags/$', query_post_related_tags, name='search-related-tags'),
    url(r'^search/users/$', search_users, name='search_users'),
    url(r'suggestedTagsAndCategories', get_suggested_tags_and_categories, name="suggestedTagsAndCategories"),
    url(r'^kudos/give/$', give_kudos, name='give-kudos'),
    url(r'^available-kudos/$', get_available_kudos, name='available-kudos'),
    url(r'^give-kudos/$', give_kudos, name='give-kudos'), 
    url(r'^post-count/$', PostViewSet.get_post_count, name='get-post-count'),
    url(r'^comment-count/$', CommentViewSet.get_comment_count, name='get_comment_count'),
    url(r'^top-tags/$', TagViewSet.get_top_tags, name='get-top-tags'),
    url(r'^invitation-read-receipt.png$', record_invitation_email_opened, name="invitation-read-receipt.png"),
    url(r'^batch/comments/$', request_multiple_comments, name="batch-fetch-comments"),
    url(r'^batch/groups/$', request_multiple_groups, name="batch-fetch-groups"),
    url(r'^batch/kudos-given/$', request_multiple_kudos_given, name="batch-fetch-kudos-given"),
    url(r'^batch/places/$', request_multiple_places, name="batch-fetch-places"),
    url(r'^batch/posts/$', request_multiple_posts, name="batch-fetch-posts"),
    url(r'^batch/tags/$', request_multiple_tags, name="batch-fetch-tags"),
    url(r'^batch/users/$', request_multiple_users, name="batch-fetch-users"),
    url(r'^loop/manage/add-loop-members/$', add_loop_members, name="add-loop-members"),
    url(r'^loop/manage/add-loop-administrator/$', add_loop_administrator, name="add-loop-administrator"),
    url(r'^loop/manage/update-user-engagement-section/$', update_user_engagement_section, name="update-user-engagement"),
    url(r'^loop/manage/change-membership-status', change_membership_status, name="change-membership-status"),
    url(r'^loop/(?P<loop_id>\d+)/users/$', get_loop_users, name='loop-users'),
    url(r'^telemetry/log-simple-action', log_simple_action, name="log-simple-action"),
    url(r'^telemetry/log-navigation-action', log_navigation_action, name="log-navigation-action"),
    url(r'^registration/is-email-registered', is_email_registered, name="is-email-registered"),
    url(r'^registration/is-username-registered', is_username_registered, name="is-username-registered"),
    url(r'^registration/validate-new-password', validate_new_password, name="validate-new-password"),
    url(r'^registration/register-new-user', register_new_user, name="register-new-user"),
    url(r'^invitation-page/$', get_invitation_page, name="invitation-page"),
    url(r'^invitation-page/accept', accept_invitation, name="accept-invitation"),
    url(r'^multi-use-invitation-page/$', get_multi_use_invitation_page, name="multi-use-invitation-page"),
    url(r'^multi-use-invitation-page/get-by-group/$', get_multi_use_invitation_page_by_group, name="multi-use-invitation-page-get-by-group"),
    url(r'^multi-use-invitation-page/edit-invitation-key/$', create_new_multi_use_invitation_key, name="create-new-multi-use-invitation-page-key"),
    url(r'^multi-use-invitation-page/accept/$', accept_multi_use_invitation, name="accept-multi-use-invitation"),
    url(r'^multi-use-invitation-page/update-visibility/$', update_visibility_multi_use_invitation, name="update-visibility-multi-use-invitation"),
    url(r'^components/photo-collections/images/(?P<photo_id>\d+)/$', get_photo_collection_image, name="get-photo-collection-image"),
    url(r'^components/photo-collections/thumbnails/(?P<photo_id>\d+)/$', get_photo_collection_thumbnail, name="get-photo-collection-thumbnail"),
    url(r'^post/newer-than/$', get_post_data_newer_than, name="posts-newer-than"),
    url(r'^post/older-than/$', get_post_data_older_than, name="posts-older-than"),
    url(r'^django-rq/', include('django_rq.urls')),
    url(r'^shop/create-order/$', create_order, name="shop-create-order"),
    url(r'^shop/process-order/$', process_order, name="shop-process-order")
   
]